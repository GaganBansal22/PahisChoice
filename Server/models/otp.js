const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        collation: { locale: 'en', strength: 2 }
    },
    otp: "string",
    createdAt: { type: Date, expires: 300 , default: Date.now }
})

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("otp", otpSchema);