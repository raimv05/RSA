const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors"); // Import cors package
const app = express();
const port = 5000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Generate RSA keys
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

// Encrypt using public key
const encryptText = (text) => {
  const buffer = Buffer.from(text, "utf-8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

// Decrypt using private key
const decryptText = (encryptedText) => {
  const buffer = Buffer.from(encryptedText, "base64");
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf-8");
};

// Endpoint to encrypt the text
app.post("/encrypt", (req, res) => {
  const { text } = req.body;
  const encryptedText = encryptText(text);
  res.json({ encryptedText });
});

// Endpoint to decrypt the text
app.post("/decrypt", (req, res) => {
  const { encryptedText } = req.body;
  const decryptedText = decryptText(encryptedText);
  res.json({ decryptedText });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
