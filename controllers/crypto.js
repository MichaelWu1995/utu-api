const db = require("../models/db");
const moment = require("moment");
const config = require("../config");

exports.list = async (req, res, next) => {
  try {
    const { date } = req.query;
    const formatDate = Date.parse(date);
    const today = moment(formatDate).format("MMM DD, YYYY");
    const last7 = moment(formatDate).subtract(6, "days").format("MMM DD, YYYY");
    const last30 = moment(formatDate)
      .subtract(1, "months")
      .format("MMM DD, YYYY");

    if (moment(formatDate).isBefore("2019-11-26")) {
      return res.status(400).json({
        error: "No Results Found",
      });
    }

    const sqlStr = `SELECT * FROM crypto WHERE Issue_Date = '${today}' OR Issue_Date = '${last7}' OR Issue_Date = '${last30}'`;
    const results = await db.query(sqlStr);

    const newList = [];
    for (index = 0; index < results.length; index = index + 3) {
      if (!results[index]) {
        return res.status(400).json({
          error: "No Results Found",
        });
      }

      newList.push({
        coin: results[index].Currency,
        price: "$" + results[index].Close,
        day_difference: config.formatDifference(
          (results[index].Close - results[index].Open) / results[index].Open
        ),
        week_difference: config.formatDifference(
          (results[index].Close - results[index + 1].Close) /
            results[index + 1].Close
        ),
        month_difference: config.formatDifference(
          (results[index].Close - results[index + 2].Close) /
            results[index + 2].Close
        ),
        volume: config.formatPrice(results[index].Volume),
        market_cap: config.formatPrice(results[index].Market_Cap),
      });
    }

    res.status(200).json(newList);
  } catch (err) {
    next(err);
  }
};
