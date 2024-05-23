const nodemailer = require('nodemailer');

module.exports.sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',user: process.env.EMAIL_FOR_OTP, pass: process.env.EMAIL_PASS_FOR_OTP,
                clientId: process.env.EMAIL_CLIENT_ID_FOR_OTP,
                clientSecret: process.env.EMAIL_CLIENT_SECRET_FOR_OTP,
                refreshToken: process.env.EMAIL_CLIENT_REFRESH_TOKEN_FOR_OTP
            }
        });
        const mailOptions = { from: process.env.EMAIL_FOR_OTP, to, subject, text, };
        await transporter.sendMail(mailOptions);
        return ({ status: "success" })
    } catch (error) {
        return ({ error: true })
    }
}

module.exports.getInstaMojoToken=async()=>{
    try {
        const getTokenOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.INSTA_MOJO_CLIENT_ID, client_secret: process.env.INSTA_MOJO_CLIENT_SECRET })
        };
        let getTokenResponse = await fetch(`${process.env.INSTA_MOJO_URL}/oauth2/token/`, getTokenOptions)
        let getTokenResponseData = await getTokenResponse.json()
        return(getTokenResponseData.access_token)
    } catch (error) {
        return ""
    }
}