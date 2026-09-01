const mongoose = require ('mongoose')
const User = require('../models/user')


const ProjectSchema = new mongoose.Schema({
    name : {type : String , required : true},
    creater : {type: mongoose.Schema.Types.ObjectId , ref : 'User' , required : true},
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

ProjectSchema.statics.FindQas = function (projectId){
   const qas =   this.assignedqas()
   if(qas.length !=0){
 return qas
   }
   else{
    return false
   }
  
}

module.exports  = mongoose.model('Project',ProjectSchema )