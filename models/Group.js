const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateOfCreation: {
    type: Date,
    default: Date.now
  },
  posts: [
    {
      type: String
    }
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'users',
    }
  ]
});

module.exports = Group = mongoose.model("groups", GroupSchema);