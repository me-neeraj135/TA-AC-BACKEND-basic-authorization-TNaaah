/** @format */

let express = require(`express`);
let router = express.Router();
let Article = require(`../models/Article`);
let Comment = require(`../models/Comment`);
let auth = require(`../middlewares/auth`);

router.get(`/`, (req, res, next) => {
  let info = req.flash(`info`)[0];
  Article.find({}, (err, articles) => {
    if (err) return next(err);

    res.render(`articles`, { articles, info });
  });
});

// add article

router.get(`/new`, auth.loggedInUser, (req, res, next) => {
  res.render(`add-article`);
});

router.post(`/`, (req, res, next) => {
  req.body.author = req.session.userId;
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    // console.log((err, article));
    res.redirect(`/articles/` + article.id);
  });
});

// find single article

router.get(`/:id`, (req, res, next) => {
  let id = req.params.id;
  let info = req.flash(`info`)[0];
  console.log(info);

  Article.findById(id)
    .populate(`author`, "name email ")
    .populate(`comments`, "name comment like dislike")
    .exec((err, article) => {
      if (err) return next(err);

      // console.log(article, `pop`);
      res.render(`single-article`, { article, info });
    });
});

// all protected route

router.use(auth.loggedInUser);

// edit article

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    // console.log(req.session.userId === article.author.toString(), `comm`);
    if (req.session.userId === article.author.toString()) {
      // console.log(err, article, `edit`);
      res.render(`edit-article`, { article });
    } else {
      req.flash(`info`, `you are not authorized to edit this article`);
      res.redirect(`/articles/` + article.id);
    }
  });
});

router.post(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Article.findByIdAndUpdate(id, req.body, { new: true }, (err, article) => {
    if (err) return next(err);
    // console.log(err, article, `updated`);
    req.flash(`info`, `article updated successfully`);
    res.redirect(`/articles/` + article.id);
  });
});

// delete article

router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if (err) return next(err);
    if (req.session.userId === article.author.toString()) {
      Article.deleteOne({ id: id }, (err, article) => {
        if (err) return next(err);

        Comment.deleteMany({ articleId: id }, (err, comment) => {
          if (err) return next(err);
          res.redirect(`/articles`);
        });
      });
    } else {
      req.flash(`info`, `you are not authorized to delete this article`);
      res.redirect(`/articles/` + id);
    }
  });
});

// comment on article

router.post(`/:id/comment`, (req, res, next) => {
  let id = req.params.id;
  req.body.name = req.user.name;
  req.body.articleId = id;
  req.body.authorId = req.session.userId;
  Comment.create(req.body, (err, comment) => {
    if (err) {
      if (err.name === `ValidationError`) {
        req.flash(`info`, err.message);
        return res.redirect(`/articles/` + id);
      }
    } else {
      // console.log(err, comment);

      Article.findByIdAndUpdate(
        id,
        { $push: { comments: comment.id } },
        { new: true },
        (err, article) => {
          if (err) return next(err);
          res.redirect(`/articles/` + id);
        }
      );
    }
  });
});

// like article

router.get(`/:id/like`, (req, res, next) => {
  let id = req.params.id;
  let userId = req.session.userId;

  Article.findById(id, (err, article) => {
    if (err) return next(err);
    if (article.like.includes(userId)) {
      Article.findByIdAndUpdate(
        id,
        { $pull: { like: userId } },
        { new: true },
        (err, article) => {
          if (err) return next(err);
          res.redirect(`/articles/` + id);
        }
      );
    } else {
      Article.findByIdAndUpdate(
        id,
        { $push: { like: userId } },
        { new: true },
        (err, article) => {
          if (err) return next(err);
          res.redirect(`/articles/` + id);
        }
      );
    }
  });
});

// dislike article

router.get(`/:id/dislike`, (req, res, next) => {
  let id = req.params.id;
  let userId = req.session.userId;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    if (article.dislike.includes(userId)) {
      Article.findByIdAndUpdate(
        id,
        { $pull: { dislike: userId } },
        { new: true },
        (err, article) => {
          if (err) return next(err);
          res.redirect(`/articles/` + id);
        }
      );
    } else {
      Article.findByIdAndUpdate(
          id,
        { $push: { dislike: userId } },
        { new: true },
        (err, article) => {
          if (err) return next(err);
          res.redirect(`/articles/` + id);
        }
      );
    }
  });
});

module.exports = router;
