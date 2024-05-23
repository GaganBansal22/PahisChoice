const mongoose=require("mongoose");

const AdminSchema=new mongoose.Schema({
    email: "string",
    hash: "string",
})

module.exports= mongoose.model("Admin",AdminSchema);