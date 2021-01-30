"use strict";
var _ = require("lodash");
const service = require("../services/services");
const helpers = require("../helpers/helpers");
var dict = {};
var payer = [];
var payerPoints = [];
var deduction = {};

exports.addEntry = function (req, res) {
  //checking if the request has payer and points
  if (!helpers.checkIfReqEmpty(req)) {
    return res.status(400).json({
      msg: "Need valid points!",
    });
  }

  var currentPayer = req.body[0];
  var points = parseInt(req.body[1].substr(0, req.body[1].indexOf(" ")));

  let result;
  try {
    //calling the service function
    result = service.insertEntry({
      params: currentPayer,
      points,
      dict,
      payer,
      payerPoints,
    });
  } catch (error) {
    return res.sendStatus(400).json({
      msg: result.message,
    });
  }

  if (result.status === 400) {
    return res.status(400).json({
      msg: result.message,
    });
  }

  if (result.status === 200) {
    dict = result.dict;
    payer = result.payer;
    payerPoints = result.payerPoints;

    return res.status(200).json({
      Added: points + " points to " + currentPayer,
    });
  }
};

exports.balance = function (req, res) {
  //checking if any payer has points
  if (helpers.checkIfObjEmpty(dict)) {
    return res.status(400).json({
      msg: "No points available",
    });
  }

  let result;
  try {
    //calling the service function
    result = service.getBalance(dict);
  } catch (error) {
    return res.sendStatus(400).json({
      msg: result.message,
    });
  }

  if (result.status === 400) {
    return res.status(400).json({
      msg: result.message,
    });
  }

  if (result.status === 200) {
    return res.status(200).json({
      "List of Payers and points": result.message,
    });
  }
};

exports.deduct = function (req, res) {
  //checking if any payer has points
  if (!helpers.checkIfPointsEmpty(req)) {
    return res.status(400).json({
      msg: "Need valid points!",
    });
  }
  var points = parseInt(req.body[0]);

  let result;
  try {
    //calling the service function
    result = service.deduct({
      points,
      dict,
      payer,
      payerPoints,
      deduction,
    });
  } catch (error) {
    return res.sendStatus(400).json({
      msg: error,
    });
  }

  if (result.status === 400) {
    return res.status(400).json({
      msg: result.message,
    });
  }

  if (result.status === 200) {
    dict = result.dict;
    payer = result.payer;
    payerPoints = result.payerPoints;
    deduction = result.deduction;

    return res.status(200).json({
      deduction,
    });
  }
};
