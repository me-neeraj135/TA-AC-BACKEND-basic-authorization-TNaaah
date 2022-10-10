/** @format */

let express = require(`express`);
let Comment = require(`../models/Comment`);
let auth = require(`../middlewares/auth`);
let router = express.Router();

// protected route

router.use(auth.loggedInUser);

// edit comment

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    // console.log(req.session.userId === comment.authorId.toString(), `cmt-com`);
    if (req.session.userId === comment.authorId.toString()) {
      res.render(`edit-comment`, { comment });
    } else {
      req.flash(`info`, `you can't edit others' comment`);
      res.redirect(`/articles/` + comment.articleId);
    }
  });
});

router.post(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Comment.findByIdAndUpdate(
    id,
    { comment: req.body.comment },
    (err, comment) => {
      if (err) return next(err);
      // console.log(err, comment, `up-cmt`);
      res.redirect(`/articles/` + comment.articleId);
    }
  );
});

// delete comment

router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;

  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (req.session.userId === comment.authorId.toString()) {
      Comment.deleteOne({ id: id }, (err, acknowledged) => {
        if (err) return next(err);
        console.log(err, comment, `del`);
        res.redirect(`/articles/` + comment.articleId);
      });
    } else {
      req.flash(`info`, `you can't delete others' comment`);
      res.redirect(`/articles/` + comment.articleId);
    }
  });
});

// like comment

router.get(`/:id/like`, (req, res, next) => {
  let id = req.params.id;
  let userId = req.session.userId;

  console.log(id, userId, `like`);

  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (comment.like.includes(userId)) {
      Comment.findByIdAndUpdate(
        id,
        { $pull: { like: userId } },
        { new: true },
        (err, comment) => {
          if (err) return next(err);
          res.redirect(`/articles/` + comment.articleId);
        }
      );
    } else {
      Comment.findByIdAndUpdate(
        id,
        { $push: { like: userId } },
        { new: true },
        (err, comment) => {
          if (err) return next(err);
          res.redirect(`/articles/` + comment.articleId);
        }
      );
    }
  });
});

// dislike comment

router.get(`/:id/dislike`, (req, res, err) => {
  let id = req.params.id;
  let userId = req.session.userId;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    if (comment.dislike.includes(userId)) {
      Comment.findByIdAndUpdate(
        id,
        { $pull: { dislike: userId } },
        { new: true },
        (err, comment) => {
          if (err) return next(err);
          res.redirect(`/articles/` + comment.articleId);
        }
      );
    } else {
      Comment.findByIdAndUpdate(
        id,
        { $push: { dislike: userId } },
        { new: true },
        (err, comment) => {
          if (err) return next(err);
          res.redirect(`/articles/` + comment.articleId);
        }
      );
    }
  });
});

module.exports = router;
