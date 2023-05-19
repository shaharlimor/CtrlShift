const Schedule = require("../models/schedule");

const getSchedules = async () => {
  return await Schedule.find(
    {},
    "_id organization month year isPublished isOpenToConstraints employessAssigned"
  );
};

const boardOpenToConstraints = async (org, month, year) => {
  const ans = await Schedule.find({
    organization: org,
    month: month,
    year: year,
    isOpenToConstraints: true,
  });
  return ans.length === 1;
};

const changeOpenToConstraints = async (org, month, year) => {
  return await Schedule.updateMany(
    { organization: org, month: month, year: year },
    { isOpenToConstraints: true }
  );
};

const changePublish = async (org, month, year) => {
  return await Schedule.updateMany(
    { organization: org, month: month, year: year },
    { isPublished: true }
  );
};

const changeEmployessAssigned = async (org, month, year, changeTo) => {
  return await Schedule.updateMany(
    { organization: org, month: month, year: year },
    { employessAssigned: changeTo }
  );
};

module.exports = {
  getSchedules,
  changeOpenToConstraints,
  boardOpenToConstraints,
  changePublish,
  changeEmployessAssigned,
};
