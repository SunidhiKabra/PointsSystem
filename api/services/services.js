const _ = require("lodash");
const helpers = require("../helpers/helpers");

const insertEntry = (params) => {
  const key = params.params;
  const points = params.points;
  const dict = params.dict;
  const payer = params.payer;
  const payerPoints = params.payerPoints;

  //inserting into dict the payer and it's total points, negative inputs are considered too
  var value;
  if (dict[key] && dict[key] + points >= 0) {
    value = dict[key] + points;
    dict[key] = value;
  } else if (points >= 0) {
    value = points;
    dict[key] = value;
  } else {
    return {
      message: "Total points can't be negative for a payer",
      status: 400,
    };
  }

  //updating the payer and payerPoints to be up to date with incoming negative points
  if (points >= 0) {
    payer.push(key);
    payerPoints.push(points);
  } else {
    var currentVal = points;
    while (currentVal < 0) {
      var index = payer.indexOf(key);
      currentVal = payerPoints[index] + currentVal;
      payerPoints[index] = currentVal;

      //removing the payer and points where points are 0
      if (payerPoints[index] <= 0) {
        payerPoints.splice(index, 1);
        payer.splice(index, 1);
      }
    }
  }

  return {
    dict: dict,
    payer: payer,
    payerPoints: payerPoints,
    message: "Added",
    status: 200,
  };
};

//getting the available points for each payer
const getBalance = (dict) => {
  return {
    message: dict,
    status: 200,
  };
};

//deducting specified points from payers in sequence in order to use the oldest points first
const deduct = (params) => {
  const points = params.points;
  var dict = params.dict;
  var payer = params.payer;
  var payerPoints = params.payerPoints;
  var result = params.deduction;

  //checking if any points are available for deduction
  if (helpers.checkIfObjEmpty(dict)) {
    return {
      message: "No points are available",
      status: 400,
    };
  }

  //checking if the requested deduction is less than total available points
  if (helpers.getTotalPoints(payerPoints) < points) {
    return {
      message: "Can't deduct points more than total available points",
      status: 400,
    };
  }

  //deducting points in sequence in order to use the oldest points first
  var currentVal = points;
  payerPoints.forEach((val, index) => {
    if (currentVal <= 0) {
      return;
    }

    if (currentVal <= val) {
      payerPoints[index] = val - currentVal;
      result[payer[index]] = { value: currentVal * -1, time: "now" };
      dict[payer[index]] = dict[payer[index]] - currentVal;
      currentVal = 0;
      return;
    } else {
      result[payer[index]] = { value: val * -1, time: "now" };
      dict[payer[index]] = dict[payer[index]] - val;
      payerPoints[index] = 0;
      currentVal = currentVal - val;
    }
  });

  //remove payers with 0 points from payers and payerPoints
  var index = 0;
  while (index < payerPoints.length) {
    if (payerPoints[index] === 0) {
      payerPoints.splice(index, 1);
      payer.splice(index, 1);
    } else {
      ++index;
    }
  }

  return {
    //removing payers with 0 points from dict
    dict: helpers.filterZeroValuesFromDictionary(dict),
    payer: payer,
    payerPoints: payerPoints,
    deduction: result,
    message: "Added",
    status: 200,
  };
};

module.exports = {
  insertEntry,
  getBalance,
  deduct,
};
