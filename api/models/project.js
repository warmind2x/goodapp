import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  lcpCode: { type: String, required: [true] , unique: true},
  type: { type: String, required: [true]},
  capital: {  type: Number, default: 0},
  expenses: {type: Number, default: 0},
  grafoCap: {type: Number, default: 0},
  grafoExp: {type: Number, default: 0},
  locacion: {type: String, required:[true]},
  projectType: {type: String},
  nombre: {type: String, required:[true]},
  status: {type: String, required:[true]},
  created: {type: Date, default: Date.now()}
});


//Validator
projectSchema.plugin(uniqueValidator, { message: 'Error, Project already exists.'});


// convert to model
const Project = mongoose.model('Project', projectSchema);

export default Project;