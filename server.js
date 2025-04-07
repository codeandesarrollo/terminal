// server.js
import express from 'express';
import { Conekta } from 'conekta';

const app = express();
app.use(express.json());

const conekta = new Conekta({
  privateKey: process.env.CONEKTA_PRIVATE_KEY,
  publicKey: process.env.CONEKTA_PUBLIC_KEY,
  apiVersion: '2.0.0' // Versión API estable
});