require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const homeController = require("./controllers/home")
const adminController = require("./controllers/admin")
const cartController = require("./controllers/cart")
const reviewController = require("./controllers/review")
const userController=require("./controllers/user")
const User = require("./models/user");
const Admin = require("./models/admin")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { isAdmin } = require("./utils/admin")
const { isUserLoggedIn,verifyJwtForOTP } = require("./utils/user")
const multer = require("multer");
const { cloudinary, storage } = require("./cloudinary");
const upload = multer({ storage });
const session = require("express-session");
const MongoStore = require('connect-mongo');
const cron = require("node-cron");
const { updatePendingOrders } = require("./utils/updateOrderSatus");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.CLIENT_ADDRESS,process.env.ADMIN_ADDRESS],
    credentials: true
}));
app.use(cookieParser(process.env.cookie_Parser_Secret));

mongoose.connect(process.env.DB_URL);
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("Database connected");
});

cron.schedule("0 */5 * * *", () => {
    updatePendingOrders();
});

// cron.schedule("*/1 * * * *", () => { // for testing
//     updatePendingOrders();
// });

const sessionConfig = {
    name: "pahi'sChoice",
    secret: process.env.Session_Secret,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        touchAfter: 24 * 3600
    }),
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use(async (req, res, next) => {
    try {
        if (req.signedCookies && req.signedCookies._id) {
            let token = jwt.verify(req.signedCookies._id, process.env.jwt_secret_key);
            if (token) {
                token = new mongoose.Types.ObjectId(token)
                let admin = await Admin.findById(token);
                let user = await User.findById(token);
                if (admin) {
                    res.locals.admin = admin;
                    const newToken = jwt.sign(admin._id.toString(), process.env.jwt_secret_key);
                    res.cookie("_id", newToken, {
                        httpOnly: true,
                        signed: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7
                    })
                }
                else if (user) {
                    res.locals.user = user;
                    const newToken = jwt.sign(user._id.toString(), process.env.jwt_secret_key);
                    res.cookie("_id", newToken, {
                        httpOnly: true,
                        signed: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7
                    })
                }
                else
                    res.cookie("_id", 0, { httpOnly: true, signed: true, maxAge: 1 })
            }
        }
    } catch (error) {
        ;
    }
    next();
})

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.post("/api/send-otp",homeController.sendOTP)
app.post("/api/verify-otp",homeController.verifyOTP)

app.get("/new-arrivals",homeController.getNewArrivals)

app.post("/register",verifyJwtForOTP, userController.registerUser)
app.post("/login", userController.loginUser)
app.post("/logout", userController.logoutUser)

app.get("/search",homeController.searchProducts)

app.post("/account/forgotpassword",verifyJwtForOTP,userController.forgotPassword);
app.get("/account/addresses",isUserLoggedIn,userController.getUserAddresses)
app.post("/account/addresses/edit",isUserLoggedIn,userController.editAddress)
app.post("/account/addresses/new",isUserLoggedIn,userController.newAddress)
app.post("/account/addresses/delete",isUserLoggedIn,userController.deleteAddress)
app.get("/account/editAccount",isUserLoggedIn,userController.getAccountDetailsForUpdate)
app.post("/account/editAccount",isUserLoggedIn,userController.updateAccountDetails)
app.get("/account/myorders/:oid",isUserLoggedIn,userController.getOrderDetails)
app.get("/account/myorders",isUserLoggedIn,userController.getAllUserOrders)
app.get("/account/myordersFalied",isUserLoggedIn,userController.getAllUserFaliedOrders)
app.get("/account/wishlist",isUserLoggedIn,userController.getWishListProducts)
app.post("/account/wishlist/:pid",isUserLoggedIn,userController.addProductToWishlist)
app.delete("/account/wishlist/:pid",isUserLoggedIn,userController.deleteProductFromWishlist)

app.get("/loginStatus", homeController.getLoginStatus)

app.get("/product/:pid", homeController.getProduct)
app.get("/productList",homeController.getCategoryProducts)

app.post("/review/new", isUserLoggedIn, upload.array("image"), reviewController.newReview)

app.get("/cart", cartController.getCartProducts)
app.get("/cart/add/:pid", cartController.addProductToCart)
app.get("/cart/checkout",isUserLoggedIn,cartController.checkout)
app.post("/cart/payNow",isUserLoggedIn,cartController.payNow)
app.get("/cart/buyNow/:pid",isUserLoggedIn,cartController.buyNowAddresses)
app.post("/cart/buyNow",isUserLoggedIn,cartController.buyNowFunction)

app.post("/payment/instamojo-webhook",cartController.updatePaymentStatus)
app.get("/payment/checkPymentStatus",cartController.checkPaymentStatus)

app.post("/admin/login", adminController.loginAdmin)
app.post("/admin/logout", adminController.logoutAdmin)
app.post("/admin/forgotpassword",isAdmin,verifyJwtForOTP,adminController.forgotPassword);
app.post("/admin/product/new", isAdmin, upload.array("image"), adminController.registerProduct)
app.get("/admin/product/:pid/edit", isAdmin, adminController.getProductForEdit)
app.post("/admin/product/edit/:pid", isAdmin, upload.array("image"), adminController.editProduct)
app.get("/admin/getOrders",isAdmin,adminController.getOrders)
app.get("/admin/orders/:oid",isAdmin,adminController.getOrderDetails)
app.get("/admin/update-order-status/:oid",isAdmin,adminController.updateOrderStatus)

app.listen(5000, function () {
    console.log("Listening on port 5000");
})