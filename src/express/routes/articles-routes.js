'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`/articles/articles-by-category/:id`));
offersRouter.get(`/add`, (req, res) => res.render(`/articles/add`));
offersRouter.get(`/edit/:id`, (req, res) => res.render(`/articles/edit/:id`));
offersRouter.get(`/:id`, (req, res) => res.render(`/articles/:id`));

module.exports = offersRouter;
