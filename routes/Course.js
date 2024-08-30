// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingandReview");

const {updateCourseProgress} = require("../controllers/courseProgress");
// Importing Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

router.post("/createCourse", auth, isInstructor, createCourse);

router.post("/editCourse", auth, isInstructor, editCourse);

router.post("/addSection", auth, isInstructor, createSection);

router.post("/updateSection", auth, isInstructor, updateSection);

router.post("/deleteSection", auth, isInstructor, deleteSection);

router.post("/updateSubSection", auth, isInstructor, updateSubSection);

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/addSubSection", auth, isInstructor, createSubSection);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.get("/getAllCourses", getAllCourses);

router.post("/getCourseDetails", getCourseDetails);

router.post("/getFullCourseDetails", auth, getFullCourseDetails);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

router.delete("/deleteCourse", deleteCourse);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
