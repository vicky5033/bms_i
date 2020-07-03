const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const { Router } = require("express");

const dbService = require("../dbService");
const db = dbService.getDbServiceInstance();

// GET operation or read
router.get("/", (req, res) => {
  res.render('bms/bms_index');
});

module.exports = router;
