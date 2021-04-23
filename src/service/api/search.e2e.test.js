"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {getTestData} = require(`../../utils`);
const FILE_SEARCH_PATH = `./src/service/fixtures/search.json`;

const createAPI = (data) => {
  const app = express();
  app.use(express.json());
  search(app, new DataService(data));
  return app;
};

let api;

beforeEach(async () => {
  const data = await getTestData(FILE_SEARCH_PATH);
  api = createAPI(data);
});

describe(`Search API`, () => {
  test(`Should successful search`, async () => {
    const response = await request(api).get(`/search`).query({
      query: `Кино`,
    });
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(`OAsPMB`);
  });

  test(`API returns code 404 if nothing is found`, () =>
    request(api)
      .get(`/search`)
      .query({
        query: `Продам свою душу`,
      })
      .expect(HttpCode.NOT_FOUND));

  test(`API returns 400 when query string is absent`, () =>
    request(api).get(`/search`).expect(HttpCode.BAD_REQUEST));
});
