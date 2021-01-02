const numeral = require("numeral");

exports.formatDifference = (stat) => numeral(stat).format("0.0%");

exports.formatPrice = (stat) => numeral(stat).format("$0,0");
