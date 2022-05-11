// const upload = require('../middleware/upload');

const express = require('express');
const multer  = require('multer');

const url = process.env.MONGODB_URI || process.env.MONGODB_URL

const path = require('path');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname );
  }
})

const upload = multer({ storage: fileStorageEngine });

module.exports = function (app, Post, Comment) {
  app.get('/posts/new', (req, res) => {
    res.render('post_new', {currentUser: req.user} )
  })

  app.post('/posts', upload.single("filename"), (req, res) => {
    const currentUser = req.user;

    if (currentUser) {
      const post = new Post(req.body)
      post.username = currentUser.username
      post.imagePath = req.file.filename
      post.voteScore = 0

      post.save(() => res.redirect(`/posts/${post._id}`));
    } else {
      console.log('NEED TO BE SIGNED IN TO POST')
      return res.redirect('/')
    }
  })

  app.get('/posts/:id', async (req, res) => {
    const currentUser = req.user;
    let isOwner = null

    try {
      const post = await Post.findById(req.params.id).populate('comments').lean();
      console.log('comments', post.comments)

      if (currentUser){
        isOwner = post.username == currentUser.username;
      }

      res.render('post_show', { post, currentUser, isOwner });
    } catch (err) {
      console.log(err.message);
    }
  });

  app.post('/posts/:id', (req, res) => {
    const currentUser = req.user;
    if (!currentUser){
      return res.redirect(`/posts/${req.params.id}`)
    }

    const comment = new Comment(req.body);
    comment.username = currentUser.username;

    comment
      .save()
      .then(() => Post.findById(req.params.id))
      .then((post) => {
        post.comments.unshift(comment);
        return post.save();
      })
      .then(() => res.redirect(`/posts/${req.params.id}`))
      .catch((err) => {
        console.log(err);
      });
  });

  app.post('/posts/:comment_id', (req, res) => {
    const currentUser = req.user;

    const reply = new Comment(req.body);

    reply
      .save()
      .then(() => Comment.findById(req.params.comment_id))
      .then((comment) => {
        comment.comments.unshift(reply);
        return comment.save();
      })
      .then(() => res.redirect(`/posts`))
      .catch((err) => {
        console.log(err);
      });
  });


  app.post('/posts/:id/vote-up', (req, res) => {
    Post.findById(req.params.id).then(post => {
      post.voteScore += 1;
      post.save();

      return res.status(200);
    }).catch(err => {
      console.log(err);
    })
  });

  app.post('/posts/:id/vote-down', (req, res) => {
    Post.findById(req.params.id).then(post => {
      post.voteScore -= 1;
      post.save();

      return res.status(200);
    }).catch(err => {
      console.log(err);
    });
  });

  app.get('/posts/:id', async (req, res) => {
    const currentUser = req.user;
    let isOwner = null

    try {
      const post = await Post.findById(req.params.id).populate('comments').lean();
      console.log('comments', post.comments)

      if (currentUser){
        isOwner = post.username == currentUser.username;
      }

      res.render('post_show', { post, currentUser, isOwner });
    } catch (err) {
      console.log(err.message);
    }
  });




  app.get('/posts/:id/edit', (req, res) => {
    res.send('edit page')
  })

  app.post('/posts/:id/delete', async (req, res) => {
    const currentUser = req.user;

    try {
      const post = await Post.findById(req.params.id);

      if (post.username != currentUser.username){
        return redirect('/posts/:id')
      }

      post.delete();
      res.redirect('/');
    } catch (err) {
      console.log(err.message);
    }
  })
}
