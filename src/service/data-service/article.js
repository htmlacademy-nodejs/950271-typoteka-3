"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newOffer = Object.assign(
        {id: nanoid(MAX_ID_LENGTH), comments: []},
        article
    );

    this._articles.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldOffer = this._articles.find((item) => item.id === id);

    return Object.assign(oldOffer, article);
  }
}

module.exports = ArticleService;
