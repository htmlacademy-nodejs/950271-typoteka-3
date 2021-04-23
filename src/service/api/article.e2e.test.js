"use strict";

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {
  newArticle,
  validArticle,
  invalidArticle,
  newComment,
} = require(`../fixtures/data-to-send`);
const {getTestData} = require(`../../utils`);

const FILE_ARTICLES_PATH = `./src/service/fixtures/articles.json`;
let api;
let dataService;

beforeAll(async () => {
  api = express();
  api.use(express.json());
  const data = await getTestData(FILE_ARTICLES_PATH);
  dataService = new DataService(data);
  article(api, dataService, new CommentService());
});

beforeEach(async () => {
  dataService._articles = await getTestData(FILE_ARTICLES_PATH);
});

describe(`Article API`, () => {
  test(`Should return list of all articles`, async () => {
    const response = await request(api).get(`/articles`);
    const data = await getTestData(FILE_ARTICLES_PATH);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(data.length);
    expect(response.body[0].id).toBe(data[0].id);
  });

  test(`Should returns an article with given id`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api).get(`/articles/${data[0].id}`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.title).toBe(data[0].title);
  });

  test(`Should creates an article if data is valid`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api).post(`/articles`).send(newArticle);

    expect(response.statusCode).toBe(HttpCode.CREATED);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(data.length + 1));
  });

  test(`Should refuses to create an article if data is invalid`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(api)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Should changes existent article`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api)
      .put(`/articles/${data[0].id}`)
      .send(newArticle);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body).toEqual(expect.objectContaining(newArticle));
    await request(api)
      .get(`/articles/${data[0].id}`)
      .expect((res) => expect(res.body.title).toBe(newArticle.title));
  });

  test(`Should returns status code 404 when trying to change non-existent article`, async () => {
    await request(api)
      .put(`/articles/NOEXST`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Should returns status code 400 when trying to change an article with invalid data`, async () => {
    await request(api)
      .put(`/articles/NOEXST`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should refuses to delete non-existent article`, async () => {
    await request(api).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
  });

  test(`Should returns a list of comments to given article`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api).get(
        `/articles/${data[0].id}/comments`
    );

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(data[0].comments.length);
    expect(response.body[0].id).toBe(data[0].comments[0].id);
  });

  test(`Should ccreates a comment if data is valid`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api)
      .post(`/articles/${data[0].id}/comments`)
      .send(newComment);

    expect(response.statusCode).toBe(HttpCode.CREATED);
    expect(response.body).toEqual(expect.objectContaining(newComment));
    await request(api)
      .get(`/articles/${data[0].id}/comments`)
      .expect((res) =>
        expect(res.body.length).toBe(data[0].comments.length + 1)
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
    const data = await getTestData(FILE_ARTICLES_PATH);
    await request(api)
      .post(`/articles/${data[0].id}/comments`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Should refuses to delete non-existent comment`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    await request(api)
      .delete(`/articles/${data[0].id}/comments/NOEXST`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Should refuses to delete a comment to non-existent article`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    await request(api)
      .delete(`/articles/NOEXST/comments/${data[0].comments[0].id}`)
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`Article API`, () => {
  test(`Should correctly deletes an article`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api).delete(`/articles/${data[1].id}`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(data[1].id);
    await request(api)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(data.length - 1));
  });

  test(`Should correctly deletes a comment`, async () => {
    const data = await getTestData(FILE_ARTICLES_PATH);
    const response = await request(api).delete(
        `/articles/${data[0].id}/comments/${data[0].comments[0].id}`
    );

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.id).toBe(data[0].comments[0].id);
    await request(api)
      .get(`/articles/${data[0].id}/comments`)
      .expect((res) =>
        expect(res.body.length).toBe(data[0].comments.length - 1)
      );
  });
});
