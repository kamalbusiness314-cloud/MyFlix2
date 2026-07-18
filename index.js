const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const app = express();
const PORT = 3001;
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });
const USERS_FILE = path.join(__dirname, "users.json");

console.log("USERS_FILE:", USERS_FILE);
console.log("EXISTS:", fs.existsSync(USERS_FILE));
app.use(express.json());

app.use(session({
  secret: "myflix2_secret_key",
  resave: false,
  saveUninitialized: false
}));

function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/signup", async (req, res) => {
return res.json({ success: false, message: "Signup is disabled" });
  const { username, password } = req.body;

  let users = getUsers();
console.log(users);

  if (users.find(u => u.username === username)) {
    return res.json({
      success: false,
      message: "Username already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword
  });

  saveUsers(users);

  req.session.user = username;

  res.json({
    success: true
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let users = getUsers();

console.log(users);
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({
      success: false,
      message: "User not found"
    });
  }

  const match = password === user.password;
console.log(password);
console.log(match);

  if (!match) {
    return res.json({
      success: false,
      message: "Wrong password"
    });
  }

  req.session.user = username;

  res.json({
    success: true
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

app.get("/index.html", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }

  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/", (req, res) => {
  res.redirect("/login.html");
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.redirect("/login.html");
});
app.post("/upload", upload.single("movie"), (req, res) => {
if (req.session.user !== "alyx16164") {
  return res.send("Upload sirf Admin kar sakta hai");
}
console.log(req.file);
  res.send("Movie upload ho gayi.");
});
app.get("/admin", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }

  res.send("Welcome Admin");
});
app.listen(PORT, () => {
  console.log(`MyFlix2 running on http://localhost:${PORT}`);
});


