"use strict";

const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);
const {mockData} = require(`../fixtures/category`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`Category API`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Should return list of all articles`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(4);
    expect(response.body).toEqual(
        expect.arrayContaining([`Журналы`, `Игры`, `Животные`, `Посуда`])
    );
  });
});
