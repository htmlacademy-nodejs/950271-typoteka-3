"use strict";

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {
  mockData,
  newArticle,
  validOffer,
  invalidOffer,
  newComment,
} = require(`../fixtures/articles`);

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
  test(`Should return list of all articles`, async () => {
    const response = await request(api).get(`/articles`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(mockData.length);
    expect(response.body[0].id).toBe(mockData[0].id);
  });

  test(`Should returns an article with given id`, async () => {
    const response = await request(api).get(`/articles/${mockData[0].id}`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.title).toBe(mockData[0].title);
  });

  test(`Should creates an article if data is valid`, async () => {
    const response = await request(api).post(`/articles`).send(newArticle);

    expect(response.statusCode).toBe(HttpCode.CREATED);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(mockData.length + 1));
  });

  test(`Should refuses to create an article if data is invalid`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(api)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should changes existent article`, async () => {
    const response = await request(api)
      .put(`/articles/${mockData[0].id}`)
      .send(newArticle);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
    await request(api)
      .get(`/articles/${mockData[0].id}`)
      .expect((res) => expect(res.body.title).toBe(newArticle.title));
  });

  test(`Should returns status code 404 when trying to change non-existent article`, async () => {
    await request(api)
      .put(`/articles/NOEXST`)
      .send(validOffer)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Should returns status code 400 when trying to change an article with invalid data`, async () => {
    await request(api)
      .put(`/articles/NOEXST`)
      .send(invalidOffer)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should correctly deletes an article`, async () => {
    const response = await request(api)
      .delete(`/articles/${mockData[1].id}`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(mockData[1].id);
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(mockData.length - 1));
  });

  test(`Should refuses to delete non-existent article`, async () => {
    await request(api).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
  });

  test(`Should returns a list of comments to given article`, async () => {
    const response = await request(api).get(
        `/articles/${mockData[0].id}/comments`
    );

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(mockData[0].comments.length);
    expect(response.body[0].id).toBe(mockData[0].comments[0].id);
  });

  test(`Should ccreates a comment if data is valid`, async () => {
    const response = await request(api)
      .post(`/articles/${mockData[0].id}/comments`)
      .send(newComment);

    expect(response.statusCode).toBe(HttpCode.CREATED);
    expect(response.body).toEqual(expect.objectContaining(newComment));
    await request(api)
      .get(`/articles/${mockData[0].id}/comments`)
      .expect((res) =>
        expect(res.body.length).toBe(mockData[0].comments.length + 1)
      );
  });

  test(`Should refuses to create a comment to non-existent article and returns status code 404`, async () => {
    await request(api)
      .post(`/articles/NOEXST/comments`)
      .send({
        text: `Неважно`,
      })
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Should refuses to create a comment when data is invalid, and returns status code 400`, async () => {
    await request(api)
      .post(`/articles/${mockData[0].id}/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
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

  test(`Should refuses to delete non-existent comment`, async () => {
    await request(api)
      .delete(`/articles/${mockData[0].id}/comments/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Should refuses to delete a comment to non-existent article`, async () => {
    await request(api)
      .delete(`/articles/NOEXST/comments/${mockData[0].comments[0].id}`)
      .expect(HttpCode.NOT_FOUND);
  });
});
