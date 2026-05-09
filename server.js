const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// ✅ CORS FIX
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const SECRET_KEY = "rahasia123";

// ✅ Koneksi database + error handling
const db = mysql.createConnection({
  host: "turntable.proxy.rlwy.net",
  user: "root",
  password: "yGpwwxwtgjjKNtajCEqvIMmtfEKGpHtH",
  port: 51653,
  database: "railway"
});

// mysql://root:yGpwwxwtgjjKNtajCEqvIMmtfEKGpHtH@turntable.proxy.rlwy.net:51653/railway

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi DB gagal:", err);
  } else {
    console.log("✅ Database terhubung");
  }
});

// ✅ Middleware JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "Token diperlukan" });
  }

  // ✅ Ambil token setelah "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Format token salah" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token tidak valid / expired" });
    }

    req.user = decoded;
    next();
  });
}

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { nama, email, password, no_hp } = req.body;

    if (!nama || !email || !password || !no_hp) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (nama,email,password,no_hp) VALUES (?,?,?,?)",
      [nama, email, hash, no_hp],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Gagal register" });
        }

        res.json({ message: "Register berhasil" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password wajib" });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!result || result.length === 0) {
        return res.json({ message: "User tidak ada" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.json({ message: "Password salah" });
      }

      const token = jwt.sign(
        { id: user.id_user, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login berhasil", token });
    }
  );
});

// ================= GET PEMESANAN =================
app.get("/pemesanan", verifyToken, (req, res) => {
  db.query("SELECT * FROM pemesanan", (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal ambil data" });
    }

    res.json(result);
  });
});

// ================= SERVER =================
app.listen(3001, () => {
  console.log("🚀 Server jalan di http://localhost:3001");
});