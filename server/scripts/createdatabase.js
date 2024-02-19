const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: `${process.env.POSTGRES_HOST}`,
  port: 5432,
  user: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
});

async function createDatabase() {
  try {
    await client.connect();

    const dbName = `${process.env.POSTGRES_DATABASE}`; // replace with your database name

    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${dbName}')`
    );
    if (res.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

createDatabase();
