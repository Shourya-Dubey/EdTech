const User = require('../models/User')
const OTP = require('../models/OTP')
const otpGenerator = require("otp-generator")
const bcrypt = require('bcrypt')



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
exports.signUp = async(req, res) => {
    try{    
        //data fetch from request body
        const {
            firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp
        } = req.body;
        
        //validate 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: true,
                message: "All fields are required"
            })
        }

        //password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword value does not match, please tyr agin"
            });
        }

        //check user already present or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message:"User is already registered"
            })
        }

        //find most recent OTP stored fro the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}.limit(1));
        console.log(recentOtp);

        //validate OTP
        if(recentOtp.length == 0){
            //OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }else if(otp !== recentOtp.otp){
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message: "Invalid OTP"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create in DB

        const profileDetails = await Profile.create({
            gender: null,
            dataOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return res
        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            user,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "User cannot be registrered. Please try again"
        })
        
    }

}

//Login

//changePassword