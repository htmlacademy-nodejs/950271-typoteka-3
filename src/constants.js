"use strict";

const MAX_ID_LENGTH = 6;
const USER_ARGV_INDEX = 2;
const DEFAULT_COMMAND = `--help`;
const API_PREFIX = `/api`;

const ExitCode = {
  error: 1,
  success: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

module.exports = {
  MAX_ID_LENGTH,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  API_PREFIX,
  ExitCode,
  HttpCode,
  Env,
};
