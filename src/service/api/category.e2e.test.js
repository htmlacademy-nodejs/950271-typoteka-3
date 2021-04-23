"use strict";

const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);
const {getTestData} = require(`../../utils`);
const FILE_CATEGORY_PATH = `./src/service/fixtures/category.json`;

const createAPI = (data) => {
  const app = express();
  app.use(express.json());
  category(app, new DataService(data));
  return app;
};

let api;

beforeEach(async () => {
  const data = await getTestData(FILE_CATEGORY_PATH);
  api = createAPI(data);
});

describe(`Category API`, () => {
  test(`Should return list of all articles`, async () => {
    const response = await request(api).get(`/categories`);

    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(4);
    expect(response.body).toEqual(
        expect.arrayContaining([`Журналы`, `Игры`, `Животные`, `Посуда`])
    );
  });
});
