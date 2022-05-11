module.exports = function (app, User, Post) {
  app.get('/users', async (req, res) => {
    const currentUser = req.user;
    try {
      const users = await User.find({});
      res.render('user_index', { users, currentUser });
    } catch (err) {
      console.log(err.message);
    }
  });


  app.get('/users/:id', async (req, res) => {
    const currentUser = req.user;
    let isOwner = null

    try {
      const user = await User.findById(req.params.id);
      const posts = await Post.find({username: user.username});
      console.log(posts)

      if (currentUser){
        isOwner = user == currentUser;
      }

      res.render('user_show', { user, posts, currentUser, isOwner });
    } catch (err) {
      console.log(err.message);
    }
  });
}
