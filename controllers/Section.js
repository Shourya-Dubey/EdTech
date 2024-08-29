const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

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

        //update course with section ObjectId
        const updatedCourse = await Course.findByIdAndUpdate(courseId, 
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
            updatedCourse
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
        const {sectionName, sectionId, courseId} = req.body;

        //validate data
        if (!sectionName || !sectionId) {
          return res.status(400).json({
            success: false,
            message: "Missing Properties",
          });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        const course = await Course.findByI(courseId)
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();
        console.log(course);

        //return response
        return res.status(200).json({
            success: true,
            message: section,
            data: course
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
        const {sectionId, courseId} = req.body;

        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId
            },
        })

        const section = await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
            success: false,
            message: "Section not found",
            });
        }

        //delete associated subsection
        await SubSection.deleteMany({_id: {$in: section.subSection } })

        //findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec()

        //return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data: course
        });

    }catch(error){
        return res.status(500).json({
        success: false,
        message: "Unable to delete section, please try again",
        error: error.message,
        });
    }
}