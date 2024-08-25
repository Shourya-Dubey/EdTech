const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require("otp-generator")



//sendOTP
exports.sendOTP = async (req, res) => {
    try{
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "user already registered",
            })
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log('OTP generated: ',otp)

        //check unique otp or not
        let result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator(6, {
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }


        const otpPayload = {email, otp};

        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            ot
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}



//signUp

//Login

//changePassword