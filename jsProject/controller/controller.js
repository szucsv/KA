import Database from "better-sqlite3";
import crypto from "crypto";

const db = new Database("./database/piak.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    token TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS drinks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    alcohol TEXT,
    description TEXT,
    image TEXT,
    public INTEGER,
    user_id INTEGER
  )
`);

function hash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function makeImage(name, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400">
    <rect width="300" height="400" fill="${color}"/>
    <text x="150" y="200" font-size="26" font-family="Arial" fill="white" text-anchor="middle">${name}</text>
  </svg>`;
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}

// Alapértelmezett publikus piák feltöltése
if (!db.prepare("SELECT * FROM users WHERE username = 'barmester'").get()) {
  const admin = db
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run("barmester", hash(crypto.randomUUID()));

  const alapPiak = [
    [
      "Soproni IPA",
      "Sör",
      "4.8%",
      "Felsőerjesztésű, gyümölcsös és komlós ízvilágú sör.",
      "#d97706",
    ],
    [
      "Egri Bikavér",
      "Vörösbor",
      "13.5%",
      "Klasszikus, testes magyar vörösbor házasítás.",
      "#881337",
    ],
    [
      "Unicum",
      "Gyógynövénylikőr",
      "40%",
      "Több mint negyven gyógy- és fűszernövényből készült magyar specialitás.",
      "#14532d",
    ],
    [
      "Mojito",
      "Koktél",
      "10%",
      "Fehér rum, friss menta, lime, nádcukor és szódavíz.",
      "#0d9488",
    ],
  ];

  for (const [name, type, alcohol, description, color] of alapPiak) {
    db.prepare(
      `INSERT INTO drinks (name, type, alcohol, description, image, public, user_id)
       VALUES (?, ?, ?, ?, ?, 1, ?)`
    ).run(
      name,
      type,
      alcohol,
      description,
      makeImage(name, color),
      admin.lastInsertRowid
    );
  }
}

export function getUserByName(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

export function getUserByToken(token) {
  return db.prepare("SELECT * FROM users WHERE token = ?").get(token);
}

export function register(username, password) {
  if (getUserByName(username)) return "err";
  return db
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, hash(password));
}

export function login(username, password) {
  const user = getUserByName(username);
  if (!user || user.password != hash(password)) return null;
  const token = crypto.randomUUID();
  db.prepare("UPDATE users SET token = ? WHERE id = ?").run(token, user.id);
  return token;
}

export function logout(userId) {
  db.prepare("UPDATE users SET token = NULL WHERE id = ?").run(userId);
}

export function getPublicDrinks() {
  return db
    .prepare(
      `SELECT drinks.*, users.username FROM drinks
       JOIN users ON users.id = drinks.user_id
       WHERE public = 1 ORDER BY drinks.id DESC`
    )
    .all();
}

export function getMyDrinks(userId) {
  return db
    .prepare("SELECT * FROM drinks WHERE user_id = ? ORDER BY id DESC")
    .all(userId);
}

export function getDrinkById(id) {
  return db.prepare("SELECT * FROM drinks WHERE id = ?").get(id);
}

export function createDrink(name, type, alcohol, description, image, pub, userId) {
  return db
    .prepare(
      `INSERT INTO drinks (name, type, alcohol, description, image, public, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(name, type, alcohol, description, image, pub, userId);
}

export function updateDrink(id, name, type, alcohol, description, image, pub) {
  return db
    .prepare(
      `UPDATE drinks SET name = ?, type = ?, alcohol = ?, description = ?,
       image = ?, public = ? WHERE id = ?`
    )
    .run(name, type, alcohol, description, image, pub, id);
}

export function deleteDrink(id) {
  return db.prepare("DELETE FROM drinks WHERE id = ?").run(id);
}
