let assert = require("assert");
let waiterApp = require("../waiter-app");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/kitten_inn';

const pool = new Pool({
    connectionString
  });