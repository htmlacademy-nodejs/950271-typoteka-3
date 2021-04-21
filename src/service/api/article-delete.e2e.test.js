"use strict";

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {mockData} = require(`../fixtures/articles`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

let api;

beforeEach(() => {
  api = createAPI();
});

describe(`Article API`, () => {
  test(`Should correctly deletes an article`, async () => {
    const response = await request(api).delete(`/articles/${mockData[1].id}`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(mockData[1].id);
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(mockData.length - 1));
  });

  test(`Should correctly deletes a comment`, async () => {
    const response = await request(api).delete(
        `/articles/${mockData[0].id}/comments/${mockData[0].comments[0].id}`
    );

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(mockData[0].comments[0].id);
    await request(api)
      .get(`/articles/${mockData[0].id}/comments`)
      .expect((res) =>
        expect(res.body.length).toBe(mockData[0].comments.length - 1)
      );
  });
});
