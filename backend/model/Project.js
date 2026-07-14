import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title:String,

  description:String,

  image:{
    type:String,
    default:"https://images.unsplash.com/photo-..."
  },

  category:{
    type:String,
    default:"Web App"
  },

  projectType:{
    type:String,
    default:"Hackathon"
  },

  visibility:{
    type:String,
    default:"Public"
  },

  requiredSkills:[String],

  status:{
    type:String,
    default:"Active"
  },

  githubLink:String,

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  teamMembers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]
},
{
 timestamps:true
});

const Project = mongoose.model("Project", projectSchema);

export default Project;