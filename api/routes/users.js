const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//models import
import User from '../models/user';


//POST -> req.body
//GET -> req.query

//******************
//**** A P I *******
//******************

//LOGIN
router.post("/login", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      var user = await User.findOne({ email: email });
  
      //if no email
      if (!user) {
        const response = {
          status: "error",
          error: "Invalid Credentials"
        };
        return res.status(401).json(response);
      }
  
      //if email and password ok
      if (bcrypt.compareSync(password, user.password)) {
        user.set("password", undefined, { strict: false });
  
        const token = jwt.sign({ userData: user }, "securePasswordHere", {
          expiresIn: 60 * 60 * 24 * 30
        }); 
  
        const response = {
          status: "success",
          token: token,
          userData: user
        };
  
        return res.json(response);
      } else {
        const response = {
          status: "error",
          error: "Invalid Credentials"
        };
        return res.status(401).json(response);
      }
    } catch (error) {
      console.log(error);
    }
  });

  //REGISTER
router.post("/register", async (req, res) => {
    try {
      
      const usuario = req.body.usuario
      const email = req.body.email;
      const password = req.body.password;
      const userId = req.body.userId;
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const created = Date.now()
  
      const newUser = {
        
        email: email,
        usuario: usuario,
        password: encryptedPassword,
        userId: userId,
        created: created
      };
  
      var user = await User.create(newUser);
  
  
      const response = {
        status: "success"
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.log("ERROR - REGISTER ENDPOINT");
      console.log(error);
  
      const response = {
        status: "error",
        error: error
      };
  
      console.log(response);
  
      return res.status(500).json(response);
    }
  });




  module.exports = router;