import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const reqSchema = new Schema({
  shoppingCart: { type: String, required: [true], unique:true},
  lcpCode: {type: String},
  nombreProyecto: {type: String},
  descripcionGasto: {type: String, required: [true]},
  cost: {type: Number, default: null},
  ordenCompra: {type: Number, default: null},
  fechaGasto: {type: String, required:[true]},
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  userId: {type: String, required:[true]},
  created: {type: Date, default: Date.now()}
});


//Validator
reqSchema.plugin(uniqueValidator, { message: 'Error, Shopping cart already exists.'});


// convert to model
const Requisicion = mongoose.model('Requisicion', reqSchema);

export default Requisicion;