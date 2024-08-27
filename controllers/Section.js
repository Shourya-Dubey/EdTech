const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req, res) => {
    try{
        //fetch data
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update course with sectin ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, 
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new: true}
        ).populate("")

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourseDetails
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message
        });
    }
};


exports.updateSection = async(req, res) =>{
    try{
        //fetch data
        const {sectionName, sectionId} = req.body;

        //validate data
        if (!sectionName || !sectionId) {
          return res.status(400).json({
            success: false,
            message: "Missing Properties",
          });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully"
        });

    }catch(error){
        return res.status(500).json({
        success: false,
        message: "Unable to update section, please try again",
        error: error.message,
        });
    }
};


exports.deleteSection = async(req, res) => {
    try{
        //get id from params
        const {sectionId} = req.params;

        //findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully"
        });

    }catch(error){
        return res.status(500).json({
        success: false,
        message: "Unable to delete section, please try again",
        error: error.message,
        });
    }
}