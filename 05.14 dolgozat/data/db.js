import DataBase from "better-sqlite3"


const db = new Database("./data/database.sqlite");

db.prepare(
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title STRING,
    content STRING)`,
).run();

export const getAllposts = () =>
  db.prepare(
      `SELECT * FROM posts`,).all();

export const getPostById = (id) =>
  db.prepare(
    `SELECT * FROM posts WHERE id = ?`,).get(id);

export const savePost = (title, content) =>
  db.prepare(
    `INSERT INTO posts (title, content) VALUES (?, ?)`,).run(title, content);

export const deletePost = (id) =>
  db.prepare(`DELETE FROM posts WHERE id = ?`).run(id);
