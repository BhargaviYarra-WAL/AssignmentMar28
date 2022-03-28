var express = require("express");
var router = express.Router();
router.get("/setsession/:name/:value", function (req, res) {
  req.session[req.params.name] = req.params.value;
  res.send(
    `session with name as ${req.params.name} and value as ${req.params.value} set`
  );
});
router.get("/delete/:name", function (req, res) {
  delete req.session[req.params.name];
  res.send(`Session with name ${req.params.name} is deleted`);
});
router.get("/destroy", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      res.send(`Error while deleting`);
    } else {
      res.send(`session destroyed`);
    }
  });
});
module.exports = router;
