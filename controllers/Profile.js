const { default: mongoose } = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.updateProfile = async(req, res) => {
    try{
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
        } = req.body
        const id = req.body.id

        //find Profile by id
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails)

        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
        })
        await user.save()

        //update Profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;
        //Save updated profile
        await profile.save();


        //Find updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated Succesfully",
            updatedUserDetails,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "in catch block"
        });
    }
};


//delete account
exports.deleteAccount = async(req, res) => {
    try{
      //fetch id
      const id = req.user.id;

      //validation
      const user = await user.findById({_id: id})
      if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found",
        })
      }

      //delete userProfile
      await Profile.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(user.additionalDetails) })
      for(const courseId of user.courses){
        await Course.findByIdAndUpdate(
            courseId,
            {$pull: {studentsEnroled: id}},
            {new: true}
        )
      }

      //delete user
      await User.findByIdAndDelete({ _id: id });

      //return response
      res.status(200).json({
        success: true,
        message: "User Delete Successfully"
     })
     
     await CourseProgress.deleteMany({userId: id})

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted successfully"
        });
    }
}


exports.getAllUserDetails = async(req, res) => {
    try{
        //fetch id
        const id = req.user.id;
        console.log("inside userDetails")
        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails)

        //return response 
        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


exports.updateDisplayPicture = async(req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id;
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      console.log(image);
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      );
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}