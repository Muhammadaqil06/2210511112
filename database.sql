CREATE DATABASE transportasi_db;
USE transportasi_db;

-- ================= USERS =================
CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  no_hp VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= PEMESANAN =================
CREATE TABLE pemesanan (
  id_pemesanan INT AUTO_INCREMENT PRIMARY KEY,
  nama_penumpang VARCHAR(100),
  tujuan VARCHAR(100),
  tanggal DATE,
  jumlah_tiket INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= DATA CONTOH =================
INSERT INTO pemesanan (nama_penumpang, tujuan, tanggal, jumlah_tiket)
VALUES 
('Andi', 'Medan', '2026-05-10', 2),
('Budi', 'Jakarta', '2026-05-12', 1);ls