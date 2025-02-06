"use strict";

import express from 'express';
import cors  from 'cors';
import fs from "fs";
const app = express()
import upload from './services/multer'

// Load envs from .env file
if (fs.existsSync("./.env")) {
  require("dotenv").config();
}

import './helpers/cronJob'


app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:4200', 
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
//   allowedHeaders: ['Content-Type', 'Authorization'], 
// }));

// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
//   res.sendStatus(200);
// });


// app.use("/admin/v1/student", upload.single('image')); // Apply multer to this route or sub-routes


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true,limit: '50mb'}));
app.use('/uploads', express.static('uploads'));


const adminRoutes = require("./routes/api/adminRoutes");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});


app.use("/admin/v1", adminRoutes);



module.exports = app;