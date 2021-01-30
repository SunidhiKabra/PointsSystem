"use strict";

const express = require("express");
const router = express.Router();

var controller = require("../controllers/controllers");

router.get("/", (req, res) => {
  return res.json({
    message:
      "Welcome to the points maintainance system. Go to one of the specified routes to do add points, get balance or deduct points for a user.",
  });
});

router.post("/add", (req, res) => {
  controller.addEntry(req, res);
});

router.get("/balance", (req, res) => {
  controller.balance(req, res);
});

router.post("/deduct", (req, res) => {
  controller.deduct(req, res);
});

module.exports = router;
