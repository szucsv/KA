
import express from "express";
import * as db from "./data/db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/equipment/:id", (req, res) => {
  const id = req.params.id;
  const equipment = db.getEquipmentById(id);

  if (!equipment) {
    return res.status(404).json();
  }

  res.status(200).json(equipment);
});

app.get("/api/equipment/category/:category", (req, res) => {
  const category = req.params.category;
  const equipments = db.getEquipmentByCategory(category);

  if (equipments.length === 0) {
    return res.status(404).json();
  }

  res.status(200).json(equipments);
});

app.put("/api/equipment/:id", (req, res) => {
  const id = req.params.id;

  const existingEquipment = db.getEquipmentById(id);
  if (!existingEquipment) {
    return res.status(404).json();
  }

  const { name, category, brand, price, quantity } = req.body;

  if (
    name === undefined ||
    category === undefined ||
    brand === undefined ||
    price === undefined ||
    quantity === undefined
  ) {
    return res.status(400).json();
  }

  const updatedEquipment = db.updateEquipment(
    id,
    name,
    category,
    brand,
    price,
    quantity
  );

  res.status(200).json(updatedEquipment);
});

app.delete("/api/equipment/:id", (req, res) => {
  const id = req.params.id;
  const equipment = db.getEquipmentById(id);

  if (!equipment) {
    return res.status(404).json();
  }

  db.deleteEquipment(id);
  res.status(200).json();
});

app.listen(PORT, () => {
  console.log(`Fut a szerver a ${PORT}-es porton`);
});
