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

module.exports =  { getPostWithUsername };