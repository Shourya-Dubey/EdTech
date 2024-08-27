const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


//create Subsection
exports.createSubSection = async(req, res) => {
    try{
        //fetch data 
        const {sectionId, title, timeDuration, description} = req.body;

        //extract file/video
        const video = req.files.videoFile;

        //validation
        if(!sectionId || !title || !!timeDuration || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //create subsection
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        });

        //update section with sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, 
            {$push: {
                subSection: subSectionDetails._id
            }}, 
            {new:true}) //Todo log updated section here, after adding populate query

        //retrun response
        return res.status(200).json({
            success: true,
            message: "Sub Section Created Successfully",
            updatedSection
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error.message
        })
    }
};


//updateSubSection
exports.updateSubSection = async(req, res) =>{
    try{
        const {sectionId, subSectionId, title, description} = req.body;

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
            success: false,
            message: "SubSection notfound",
            });
        }

        if(title !== undefined){
            subSection.title = title
        }

        if(description !== undefined){
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

            subSection.videoUrl = uploadDetails.secure_url

            subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save()

        //return updated section
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        console.log("updated Section: ", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
        });
    }
}


//Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(
        {_id: sectionId},
        {
            $pull: {
                subSection: subSectionId,
            },
        }
    )

    const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})

    if(!subSection){
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        });
    }

    const updateSection = await Section.findById(sectionId).populate("subSection")

    return res.json({
        success: true,
        message: "SubSection delete successfully",
        data: updateSection
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};