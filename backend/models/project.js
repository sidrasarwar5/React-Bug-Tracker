const mongoose = require ('mongoose')
const User = require('../models/user')


const ProjectSchema = new mongoose.Schema({
    name : {type : String , required : true},
    creater : {type: mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
     logo: { type: String },
    description: {
  type: String,
  default: "",
},
    assignedqas:[
        {type: mongoose.Schema.Types.ObjectId ,
        ref : 'User' , required : true
        }
    ],
    assigneddeveloper:[
        {type: mongoose.Schema.Types.ObjectId ,
        ref : 'User' , required : true
        }
    ],
})


  
ProjectSchema.statics.assigned_qas = function () {
  return this.find({ 'assignedqas.0': { $exists: true } });
};

ProjectSchema.statics.assigned_developers = function () {
  return this.find({ 'assigneddeveloper.0': { $exists: true } });
};

module.exports  = mongoose.model('Project',ProjectSchema )