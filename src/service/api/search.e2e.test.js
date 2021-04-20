"use strict";

const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {mockData} = require(`../fixtures/search`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`Search API`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `Кино`,
    });
  });

  test(`Should successful search`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(`OAsPMB`);
  });

  test(`API returns code 404 if nothing is found`, () =>
    request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`,
      })
      .expect(HttpCode.NOT_FOUND));

  test(`API returns 400 when query string is absent`, () =>
    request(app).get(`/search`).expect(HttpCode.BAD_REQUEST));
});
