 import Database from "better-sqlite3";

const db = new Database("./data/sports.db");


export const getEquipmentById = (id) =>
   db.prepare(
    `
    SELECT * FROM sports where id = ?
    `
).get(id);

export const getEquipmentByCategory = (category) =>
   db.prepare(
    `
    SELECT * FROM sports where category = ?
    `
).all(category);

export const updateEquipment = (id, name, category, brand, price, quantity) => {
  db.prepare(
    "UPDATE sports SET name = ?, category = ?, brand = ?, price = ?, quantity = ? WHERE id = ?"
  ).run(name, category, brand, price, quantity, id);
};

export const deleteEquipment = (id) => {
  return db.prepare("DELETE FROM sports WHERE id = ?").run(id);
};