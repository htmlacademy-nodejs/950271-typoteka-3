"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `unROqY`,
    title: `Музыка`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Программировать не настолько сложно, как об этом говорят.  Из под его пера вышло 8 платиновых альбомов.`,
    createdDate: 1613841223609,
    сategory: [`Игры`, `Журналы`, `Книги`],
    comments: [
      {id: `4NZzBO`, text: `Это где ж такие красоты?`},
      {
        id: `THBpGB`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`,
      },
      {
        id: `0dOXmk`,
        text: `Хочу такую же футболку :-)  Плюсую, но слишком много буквы!`,
      },
      {id: `GpIj12`, text: `Совсем немного...`},
      {
        id: `tivLj-`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Хочу такую же футболку :-)`,
      },
    ],
  },
  {
    id: `sR9it6`,
    title: `Разное`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь.  Это один из лучших рок-музыкантов.`,
    fullText: `Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.  Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят.`,
    createdDate: 1607287030325,
    сategory: [`Животные`, `Книги`, `Игры`],
    comments: [
      {id: `qg3_6z`, text: `Согласен с автором! Совсем немного...`},
      {
        id: `gGPcPr`,
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {id: `wv4XX7`, text: `Согласен с автором!`},
    ],
  },
  {
    id: `jZPwHZ`,
    title: `За жизнь`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов.  Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    createdDate: 1610093276193,
    сategory: [`Разное`],
    comments: [
      {
        id: `yeJffA`,
        text: `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`,
      },
      {id: `ruGPSF`, text: `Согласен с автором!`},
      {
        id: `uW3iso`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне кажется или я уже читал это где-то?`,
      },
      {
        id: `ajzh83`,
        text: `Это где ж такие красоты? Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
  {
    id: `SG1xWF`,
    title: `Без рамки`,
    announce: `Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. `,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Как начать действовать? Для начала просто соберитесь.`,
    createdDate: 1613152873898,
    сategory: [`Игры`, `Животные`, `Разное`, `Посуда`, `Книги`, `Журналы`],
    comments: [
      {
        id: `xdqsrJ`,
        text: `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`,
      },
    ],
  },
  {
    id: `QASPV3`,
    title: `Разное`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.  Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    createdDate: 1612374914574,
    сategory: [`Животные`, `Разное`, `Посуда`, ``, `Журналы`, `Игры`],
    comments: [
      {
        id: `6xx3Y5`,
        text: `Плюсую, но слишком много буквы! Совсем немного... Это где ж такие красоты?`,
      },
      {id: `HhJLOV`, text: `Совсем немного...`},
      {id: `PdwO5p`, text: `Планируете записать видосик на эту тему?`},
      {
        id: `l1kzFy`,
        text: `Плюсую, но слишком много буквы! Согласен с автором!`,
      },
      {
        id: `K3QZit`,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`First article's id equals "unROqY"`, () =>
    expect(response.body[0].id).toBe(`unROqY`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/unROqY`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer's title is "Музыка"`, () =>
    expect(response.body.title).toBe(`Музыка`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Разное`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    сategory: [`Иное`],
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Offers count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Разное`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    сategory: [`Иное`],
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Разное`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    сategory: [`Иное`],
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/unROqY`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Offer is really changed`, () =>
    request(app)
      .get(`/articles/unROqY`)
      .expect((res) => expect(res.body.title).toBe(`Разное`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validOffer = {
    title: `Это`,
    announce: `валидный`,
    fullText: `объект`,
    сategory: `объявления`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidOffer = {
    title: `Это невалидный`,
    announce: `объект объявления`,
    fullText: `без поля сategory`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/sR9it6`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () =>
    expect(response.body.id).toBe(`sR9it6`));

  test(`Article count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => {
        console.log(res.body);
        expect(res.body.length).toBe(4);
      }));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/unROqY/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 5 comments`, () =>
    expect(response.body.length).toBe(5));

  test(`First comment's id is "4NZzBO"`, () =>
    expect(response.body[0].id).toBe(`4NZzBO`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/unROqY/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () =>
    request(app)
      .get(`/articles/unROqY/comments`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/unROqY/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/unROqY/comments/tivLj-`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () =>
    expect(response.body.id).toBe(`tivLj-`));

  test(`Comments count is 4 now`, () =>
    request(app)
      .get(`/articles/unROqY/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/unROqY/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/kqME9j`)
    .expect(HttpCode.NOT_FOUND);
});
