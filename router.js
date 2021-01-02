const express = require("express");
const router = express.Router();

const cryptoController = require("./controllers/crypto");

router.get("/", (req, res, next) => {
  res.status(200).send("api server is running...");
});

router.get("/crypto", cryptoController.list);

module.exports = router;
