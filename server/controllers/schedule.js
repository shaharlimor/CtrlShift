const Schedule = require("../models/schedule");

const getSchedules = async () => {
  return await Schedule.find(
    {},
    "_id organization month year isPublished isOpenToConstraints"
  );
};

const getScheByMonthYearOrganization = async (org, month, year) => {
  return await Schedule.find({ organization: org, month: month, year: year });
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

module.exports = {
  getSchedules,
  changeOpenToConstraints,
  getScheByMonthYearOrganization,
  changePublish,
};
