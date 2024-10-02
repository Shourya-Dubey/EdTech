const express = require("express");
const {contactUsController} = require('../controllers/ContactUs')
const route = express.Router();

route.get("/reach/contact", contactUsController);

module.exports =  route;