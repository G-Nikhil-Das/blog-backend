import mongoose from "mongoose";
const {Schema, model} = mongoose;

const BlogSchema = new Schema({
    title:String,
    description:String,
    cover:String,
    comments:Array,
    author:{type:Schema.Types.ObjectId, ref:'User'},
  }, {
    timestamps: true,
  });
  
const BlogModel = model('Blog', BlogSchema);

export default BlogModel