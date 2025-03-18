// Import modul yang dibutuhkan
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 2121;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Koneksi ke MongoDB
mongoose
  .connect(
    "mongodb://admin:Palang66@129.150.60.112:27017/configapps?authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Terhubung ke MongoDB");
  })
  .catch((error) => {
    console.error("Gagal terhubung ke MongoDB:", error);
  });

// Skema dan model Mongoose untuk data 'pn'
const pnSchema = new mongoose.Schema({
  pn: { type: String, required: true, unique: true },
  safemode: { type: Boolean, default: true },
  disable: { type: Boolean, default: false },
  // Atribut baru untuk admob
  admobAppId: { type: String, default: "" },
  admobBannerId: { type: String, default: "" },
  admobInterstitialId: { type: String, default: "" },
  admobRewardedId: { type: String, default: "" },
  // Atribut baru untuk appLovin
  appLovinSdkKey: { type: String, default: "" },
  appLovinBannerId: { type: String, default: "" },
  appLovinInterstitialId: { type: String, default: "" },
  appLovinRewardedId: { type: String, default: "" },
});

const PNModel = mongoose.model("ConfigApps", pnSchema);

// Route API untuk memeriksa atau menambahkan data dengan parameter 'pn'
app.get("/api", async (req, res) => {
  const { pn } = req.query;

  if (!pn) {
    return res.status(400).json({
      message:
        "Parameter 'pn' tidak ditemukan. Pastikan Anda mengirim parameter dengan nama 'pn'.",
      status: "error",
    });
  }

  try {
    // Cek apakah data dengan 'pn' sudah ada di database
    let record = await PNModel.findOne({ pn });

    if (record) {
      // Data sudah ada, kirim respons dengan data tersebut
      res.json({
        message: `Data dengan 'pn' ${pn} sudah ada di database.`,
        data: record,
        status: "exists",
      });
    } else {
      // Data belum ada, masukkan data baru dengan 'pn' dan atribut default
      const newRecord = new PNModel({ pn });
      await newRecord.save();

      res.json({
        message: `Data baru dengan 'pn' ${pn} berhasil ditambahkan.`,
        data: newRecord,
        status: "created",
      });
    }
  } catch (error) {
    console.error("Error saat memproses data:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: error.message,
      status: "error",
    });
  }
});

// Jalankan server pada port yang ditentukan
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
