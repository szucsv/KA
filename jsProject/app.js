import express from "express";
import * as db from "./controller/controller.js";

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.listen(PORT, () => console.log("fut: http://localhost:" + PORT));

function auth(req, res, next) {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) return res.status(401).json({ message: "Jelentkezz be!" });
  req.user = user;
  next();
}

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Adj meg felhasználónevet és jelszót!" });
  const result = db.register(username, password);
  if (result == "err")
    return res.status(400).json({ message: "Ez a felhasználónév már foglalt." });
  res.status(201).json({ message: "Sikeres regisztráció!" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const token = db.login(username, password);
  if (!token)
    return res.status(401).json({ message: "Hibás felhasználónév vagy jelszó." });
  res.status(200).json({ token, username });
});

app.post("/api/logout", auth, (req, res) => {
  db.logout(req.user.id);
  res.status(200).json({ message: "Kijelentkezve." });
});

// Publikus piák lekérése (belépés nélkül is látható)
app.get("/api/drinks", (req, res) => {
  res.status(200).json(db.getPublicDrinks());
});

// Saját piák lekérése (csak belépve)
app.get("/api/my-drinks", auth, (req, res) => {
  res.status(200).json(db.getMyDrinks(req.user.id));
});

// Új pia hozzáadása
app.post("/api/drinks", auth, (req, res) => {
  const { name, type, alcohol, description, image, public: pub } = req.body;
  if (!name || !type || !alcohol)
    return res.status(400).json({ message: "Név, típus és alkoholfok kötelező!" });
  const result = db.createDrink(
    name,
    type,
    alcohol,
    description,
    image,
    pub ? 1 : 0,
    req.user.id
  );
  res.status(201).json(db.getDrinkById(result.lastInsertRowid));
});

// Saját pia módosítása
app.put("/api/drinks/:id", auth, (req, res) => {
  const drink = db.getDrinkById(req.params.id);
  if (!drink) return res.status(404).json({ message: "Nincs ilyen ital." });
  if (drink.user_id != req.user.id)
    return res.status(403).json({ message: "Ez nem a te italod!" });

  const { name, type, alcohol, description, image, public: pub } = req.body;
  if (!name || !type || !alcohol)
    return res.status(400).json({ message: "Név, típus és alkoholfok kötelező!" });
  db.updateDrink(
    req.params.id,
    name,
    type,
    alcohol,
    description,
    image || drink.image,
    pub ? 1 : 0
  );
  res.status(200).json(db.getDrinkById(req.params.id));
});

// Saját pia törlése
app.delete("/api/drinks/:id", auth, (req, res) => {
  const drink = db.getDrinkById(req.params.id);
  if (!drink) return res.status(404).json({ message: "Nincs ilyen ital." });
  if (drink.user_id != req.user.id)
    return res.status(403).json({ message: "Ez nem a te italod!" });
  db.deleteDrink(req.params.id);
  res.status(200).json({ message: "Ital törölve." });
});
