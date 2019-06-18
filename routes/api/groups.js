const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');

const Group = require('./../../models/Group');
const User = require('./../../models/User');
const Post = require('./../../models/Post');

const upload = require('./../../multer/storage');
//const { getPostWithUsername } = require('./../../services/username.service');

const getPostWithUsername = async post => {
  try {
    const user = await User.findById(post.authorId);
    post = post.toObject();
    post.userName = user.name;
  
    return post;
  } catch(err) {
    console.error(err);
  }
}

// get groups
router.get('/', (req, res) => {
  Group.find()
    .then(groups => {
      res.status(200).json(groups.reverse());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    })
});

// add a new group
router.post('/', (req, res) => {
  const group = new Group({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });

  group.save()
    .then(newGroup => {
      res.status(200).json({ newGroup });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    })
});

// add a new user to group
router.post('/users/:groupId', (req, res) => {
  const { groupId } = req.params;
  const { id } = req.body;

  Group
    .findById(groupId)
    .then(g => {
      g.users.push(id);
      return g.save();
    })
    .then(g => res.status(200).json(g))
});

// delete the user from group
router.delete('/users/:groupId', (req, res) => {
  const { groupId } = req.params;
  const { id } = req.body;

  Group
    .findById(groupId)
    .then(g => {
      g.users.pull(id);
      return g.save();
    })
    .then(g => res.status(200).json(g))
});

// get posts by group
router.get('/posts/:groupId', (req, res) => {
  const { groupId } = req.params;

  Group
    .findById(groupId)
    .then(g => {
      Post.find({
        '_id': { $in: g.posts }
      })
        .then(posts => Promise.all(
          posts.map(async p => {
            return await getPostWithUsername(p);
          })
        ))
        .then(posts => res.status(200).json(posts.reverse()))
    })
    .catch(err => console.error(err));
});

// add a new post to group
router.post('/posts/:groupId', upload, (req, res) => {
  const { groupId } = req.params;
  const { body, authorId } = req.body;
  const { filename } = req.file;
  const imagePath = path.join('uploads', filename);

  const newPost = new Post({ authorId, body, imagePath });

  newPost.save()
    .then(Group
      .findById(groupId)
      .then(g => {
        g.posts.push(newPost._id);
        return g.save();
      })
      .catch(err => console.error(err))
    ).then(resi => getPostWithUsername(newPost).then(result => res.status(200).json(result)));
})

router.patch('/posts/:postId', upload, (req, res) => {
  const { postId } = req.params;
  const { body } = req.body;

  if (req.file) {
    const { filename } = req.file;
    const imagePath = path.join('uploads', filename);

    Post.findByIdAndUpdate(postId, { body, imagePath }, (err, result) => {
      if (err) console.error(err);

      Post
        .findById(postId)
        .then(post => getPostWithUsername(post).then(result => res.status(200).json(result)))
        .catch(err => console.error(err))
    })
  } else {
    Post.findByIdAndUpdate(postId, { body }, (err, result) => {
      if (err) console.error(err);

      Post
        .findById(postId)
        .then(post => getPostWithUsername(post).then(result => res.status(200).json(result)))
        .catch(err => console.error(err))
    })
  }
})

// delete post ftom group
router.delete('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  const { groupId } = req.body;

  Post.findById(postId).then(post => {
    Post.findByIdAndRemove(postId, (err, todo) => {
      Group.findById(groupId).then(group => {
        group.posts.pull(postId);
        return group.save();
      })
    })
    return post;
  })
    .then(post => res.status(200).json(post))
    .catch(err => console.error(err));
});

module.exports = router;