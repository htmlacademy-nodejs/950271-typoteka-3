'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const {MAX_ID_LENGTH} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const FULL_TEXT_MIN = 5;
const ANNOUNCE_COUNT = 5;
const PREV_MONTH_COUNT = 3;
const MAX_COMMENTS = 10;
const MAX_OFFERS = 1000;
const FILE_NAME = `mocks.json`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getPrevMonth = () => {
  const newDate = new Date();
  return newDate.setMonth(newDate.getMonth() - PREV_MONTH_COUNT);
};

const generateComments = (count, comments) => (
  shuffle(comments)
    .slice(0, getRandomInt(1, count))
    .join(` `)
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, ANNOUNCE_COUNT).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(FULL_TEXT_MIN, (sentences.length - 1))).join(` `),
    createdDate: getRandomInt(getPrevMonth(), new Date()),
    сategory: shuffle(categories).slice(0, getRandomInt(1, (categories.length - 1))),
    id: nanoid(MAX_ID_LENGTH),
    comments: Array(getRandomInt(1, MAX_ID_LENGTH)).fill({}).map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    })),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > MAX_OFFERS) {
      console.log(`Не больше 1000 объявлений.`);
      return;
    }

    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }

  }
};
