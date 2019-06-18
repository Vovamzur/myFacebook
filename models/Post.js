const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users',
    required: true,
  },
  dateOfCreation: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    required: true
  },
  imagePath: {
    type: String
  },
});

module.exports = Post = mongoose.model("posts", PostSchema);