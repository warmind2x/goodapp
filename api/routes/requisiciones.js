const express = require("express");
const router = express.Router();
var mongoose = require('mongoose');

const { checkAuth } = require("../middlewares/authentication.js");
const jwt = require("jsonwebtoken");

import Project from "../models/project.js";
import Requisicion from "../models/requisicion.js";


//POST -> req.body
//GET -> req.query

//******************
//**** A P I *******
//******************

// Create Requisiciones
router.post("/req", checkAuth, async (req, res) => {
    try {
      
      var project = await Project.findOne({nombre: req.body.newReq.nombreProyecto});
      
      const userId = project.userId;
      
      const requisicion = new Requisicion({
        _id: new mongoose.Types.ObjectId(),
        shoppingCart: req.body.newReq.shoppingCart,
        descripcionGasto: req.body.newReq.descripcionGasto,
        ordenCompra: req.body.newReq.ordenCompra,
        fechaGasto: req.body.newReq.fechaGasto,
        userId: userId,
        cost: req.body.newReq.cost,
        lcpCode: project.lcpCode,
        nombreProyecto: project.nombre
      });

      requisicion.save( async function (err) {
        if (err) return handleError(err);
        project.requisiciones.push(requisicion._id);
        console.log(project);
        const resp = await Project.updateOne({lcpCode:project.lcpCode},{requisiciones:project.requisiciones});
        console.log(resp.modifiedCount);

      });
      
     
  
      const response = {
        status: "success"
      };
  
      return res.json(response);
    } catch (error) {
      console.log("ERROR CREATING NEW REQUESITION");
      console.log(error);
  
      const response = {
        status: "error",
        error: error
      };
  
      return res.status(500).json(response);
    }
  });

  //GET requisiciones
router.get("/req", checkAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;

    //get devices
    var req = await Requisicion.find({ userId: userId });

    //mongoose array to js array
    req = JSON.parse(JSON.stringify(req));

   
    const response = {
      status: "success",
      data: req
    };

    res.json(response);
  } catch (error) {
    console.log("ERROR GETTING REQUISICIONES");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//DELETE DEVICE
router.delete("/req", checkAuth,  async (req, res) => {
  try {
    const shoppingCart = req.query.shoppingCart;
    console.log(req.query)
    
      

    //deleting device
    const result = await Requisicion.deleteOne({ shoppingCart: shoppingCart });
    const response = {
      status: "success",
      data: result
    };

    return res.json(response);
    

      
    }

    
   catch (error) {
    console.log("ERROR DELETING PROJECT");
    console.log(error);

    const response = {
      status: "error",
      error: error
    };

    return res.status(500).json(response);
  }
});

//UPDATE DEVICE (SELECTOR)
router.put("/req", checkAuth, async (req, res) => {
  try {
    var editReq = req.body.editReq;
    console.log(editReq);

    const requisition = await Requisicion.replaceOne({shoppingCart: editReq.shoppingCart},editReq);

    if (requisition.acknowledged == true ) {
      const response = {
        status: "success"
      };

      return res.json(response);
    } else {
      const response = {
        status: "error"
      };

      return res.json(response);
    }
  } catch (error) {
    console.log(error);
  }
});

  module.exports = router;