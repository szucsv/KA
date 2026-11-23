let token = localStorage.getItem("token");
let currentUser = localStorage.getItem("username");

function updateUI() {
  if (token) {
    document.getElementById("auth-guest").classList.add("hidden");
    document.getElementById("auth-user").classList.remove("hidden");
    document.getElementById("welcome-msg").textContent = `Szia, ${currentUser}!`;
    document.getElementById("editor-box").classList.remove("hidden");
    document.getElementById("my-drinks-section").classList.remove("hidden");
    loadMyDrinks();
  } else {
    document.getElementById("auth-guest").classList.remove("hidden");
    document.getElementById("auth-user").classList.add("hidden");
    document.getElementById("editor-box").classList.add("hidden");
    document.getElementById("my-drinks-section").classList.add("hidden");
  }
  loadPublicDrinks();
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message);

  token = data.token;
  currentUser = data.username;
  localStorage.setItem("token", token);
  localStorage.setItem("username", currentUser);
  updateUI();
}

async function logout() {
  await fetch("/api/logout", {
    method: "POST",
    headers: { Authorization: token },
  });
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  updateUI();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function saveDrink() {
  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("drink-name").value;
  const type = document.getElementById("drink-type").value;
  const alcohol = document.getElementById("drink-alcohol").value;
  const description = document.getElementById("drink-desc").value;
  const isPublic = document.getElementById("drink-public").checked;
  const fileInput = document.getElementById("drink-image");

  let image = "";
  if (fileInput.files.length > 0) {
    image = await fileToBase64(fileInput.files[0]);
  } else if (!id) {
    // Ha új italt ad hozzá kép nélkül, kap egy alapértelmezett ikont
    image = "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220"><rect width="300" height="220" fill="#cbd5e1"/><text x="150" y="115" font-size="20" font-family="Arial" fill="#334155" text-anchor="middle">Nincs kep</text></svg>`);
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `/api/drinks/${id}` : "/api/drinks";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ name, type, alcohol, description, image, public: isPublic }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message);

  resetForm();
  updateUI();
}

function editDrink(drink) {
  document.getElementById("form-title").textContent = "Ital szerkesztése";
  document.getElementById("edit-id").value = drink.id;
  document.getElementById("drink-name").value = drink.name;
  document.getElementById("drink-type").value = drink.type;
  document.getElementById("drink-alcohol").value = drink.alcohol;
  document.getElementById("drink-desc").value = drink.description;
  document.getElementById("drink-public").checked = drink.public === 1;
  document.getElementById("cancel-edit").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  document.getElementById("form-title").textContent = "Új pia hozzáadása";
  document.getElementById("edit-id").value = "";
  document.getElementById("drink-name").value = "";
  document.getElementById("drink-type").value = "";
  document.getElementById("drink-alcohol").value = "";
  document.getElementById("drink-desc").value = "";
  document.getElementById("drink-image").value = "";
  document.getElementById("drink-public").checked = true;
  document.getElementById("cancel-edit").classList.add("hidden");
}

async function deleteDrink(id) {
  if (!confirm("Biztosan törlöd ezt az italt?")) return;
  const res = await fetch(`/api/drinks/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  const data = await res.json();
  if (!res.ok) return alert(data.message);
  updateUI();
}

async function loadPublicDrinks() {
  const res = await fetch("/api/drinks");
  const drinks = await res.json();
  const container = document.getElementById("public-drinks-list");
  container.innerHTML = drinks
    .map(
      (d) => `
      <div class="card">
        <img src="${d.image}" alt="${d.name}" />
        <div class="card-body">
          <h4>${d.name}</h4>
          <span class="badge">${d.type} • ${d.alcohol}</span>
          <p>${d.description || ""}</p>
          <small style="color: #666;">Feltöltötte: ${d.username}</small>
        </div>
      </div>`
    )
    .join("");
}

async function loadMyDrinks() {
  const res = await fetch("/api/my-drinks", {
    headers: { Authorization: token },
  });
  const drinks = await res.json();
  const container = document.getElementById("my-drinks-list");
  container.innerHTML = drinks
    .map(
      (d) => `
      <div class="card">
        <img src="${d.image}" alt="${d.name}" />
        <div class="card-body">
          <h4>${d.name} ${d.public ? "🌐" : "🔒"}</h4>
          <span class="badge">${d.type} • ${d.alcohol}</span>
          <p>${d.description || ""}</p>
          <button onclick='editDrink(${JSON.stringify(d).replace(/'/g, "&#39;")})'>Szerkesztés</button>
          <button class="danger" onclick="deleteDrink(${d.id})">Törlés</button>
        </div>
      </div>`
    )
    .join("");
}

updateUI();
