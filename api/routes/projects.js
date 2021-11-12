const express = require("express");
const router = express.Router();

const { checkAuth } = require("../middlewares/authentication.js");
const jwt = require("jsonwebtoken");


import Project from "../models/project";

//POST -> req.body
//GET -> req.query

//******************
//**** A P I *******
//******************

//NEW DEVICE
router.post("/project", checkAuth, async (req, res) => {
    try {
      var newProject = req.body.newProject;
      console.log(newProject);
      
  
      const project = await Project.create(newProject);
  
      
  
      const response = {
        status: "success"
      };
  
      return res.json(response);
    } catch (error) {
      console.log("ERROR CREATING NEW PROJECT");
      console.log(error);
  
      const response = {
        status: "error",
        error: error
      };
  
      return res.status(500).json(response);
    }
  });

  //GET DEVICES
router.get("/project", checkAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;

    //get devices
    var projects = await Project.find({ userId: userId });

    //mongoose array to js array
    projects = JSON.parse(JSON.stringify(projects));

   
    const response = {
      status: "success",
      data: projects
    };

    res.json(response);
  } catch (error) {
    console.log("ERROR GETTING DEVICES");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});




module.exports = router;