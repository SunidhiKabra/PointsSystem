const _ = require("lodash");

const getTotalPoints = (obj) => Object.values(obj).reduce((a, b) => a + b);

const checkIfObjEmpty = (obj) =>
  obj === undefined || obj === null || Object.keys(obj).length === 0;

const checkIfReqEmpty = (req) => {
  if (
    req === null ||
    req.body === undefined ||
    req.body[0] === undefined ||
    req.body[0] === null ||
    req.body[0].length <= 0 ||
    req.body[1] === null ||
    req.body[1] === undefined ||
    req.body[1].indexOf(" ") < 0
  ) {
    return false;
  }
  return true;
};

const checkIfPointsEmpty = (req) => {
  if (
    req === null ||
    req.body === undefined ||
    req.body[0] === undefined ||
    req.body[0] === null ||
    req.body[0].length <= 0 ||
    req.body[0] % 1 !== 0
  ) {
    return false;
  }
  return true;
};

const filterZeroValuesFromDictionary = (obj) =>
  Object.keys(obj).reduce((object, key) => {
    if (obj[key] === 0) {
      delete obj[key];
    }
    return obj;
  }, {});
module.exports = {
  getTotalPoints,
  checkIfObjEmpty,
  checkIfReqEmpty,
  checkIfPointsEmpty,
  filterZeroValuesFromDictionary,
};
