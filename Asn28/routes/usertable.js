var express = require("express");
var router = express.Router();
const connector = require("../poolconnect");
router.get("/createtable", function (req, res) {
  const sqlQuery = `CREATE TABLE user(username VARCHAR(25), password VARCHAR(100), date_of_creation DATE)`;
  connector.query(sqlQuery, function (err, results, fields) {
    res.json(results);
  });
});
router.get("/", function (req, res) {
  const sqlQuery = `SELECT * FROM user`;
  connector.query(sqlQuery, function (err, results) {
    if (err) {
      res.json({ err });
    } else {
      res.json({ results });
    }
  });
});
router.post("/", function (req, res) {
  const { username, password } = req.body;
  let date_of_creation = new Date();
  checkForUsernameQuery = `SELECT * FROM user WHERE username = "${username}"`;
  connector.query(checkForUsernameQuery, function (err, results, fields) {
    if (err) {
      res.json({ err });
    } else {
      if (results.length > 0) {
        res.json({ status: 0, debug_data: "username already exists" });
      } else {
        const sqlQuery = `INSERT INTO user ( username, password, date_of_creation) VALUES(?,?,?)`;
        connector.query(
          sqlQuery,
          [username, password, date_of_creation],
          function (err, results, fields) {
            if (err) {
              res.json(err);
            } else {
              res.json({ status: 1, data: "user created" });
            }
          }
        );
      }
    }
  });
});
router.put("/:username", function (req, res) {
  const { username, password } = req.body;
  var sql = `update user set username=?,password=? where username=?`;
  connector.query(
    sql,
    [username, password, req.params.username],
    function (err, results) {
      res.json({ err, results });
    }
  );
});
router.delete("/:username", function (req, res) {
  let sql = `delete from user where username=?`;
  connector.query(sql, [req.params.username], function (err, results) {
    res.json({ err, results });
  });
});
router.delete("/", function (req, res) {
  let sql = `delete from user`;
  connector.query(sql, function (err, results) {
    res.json({ err, results });
  });
});

router.get("/:username", function (req, res) {
  var sql = `select * from user where username=?`;
  connector.query(sql, [req.params.username], function (err, results) {
    res.json({ err, results });
  });
});
router.get("/checklogin", (req, res) => {
  const { username, password } = req.body;
  let flag = false;
  connector.query("SELECT * FROM users", (error, result) => {
    result.forEach((user) => {
      if (user.username === username && user.password === password) {
        flag = true;
      }
    });
    if (flag) {
      req.session["isLoggedIn"] = 1;
      req.session["username"] = username;
      res.json({ status: 1, data: username });
    } else {
      req.session["isLoggedIn"] = 0;
      res.json({ status: 0, data: "incorrect login details" });
    }
  });
});

router.get("/loggeduser", (req, res) => {
  if (req.session.isLoggedIn === 1) {
    const sql = "SELECT * FROM users where username=?;";
    connector.query(sql, [req.session.username], (error, result) => {
      res.json({ error, result });
    });
  } else {
    res.json({ status: 0, debug_data: "you are not logged in " });
  }
});
{
}
router.get("/checklogin/:username/:password", function (req, res) {
  var sql = `select * from user where username=? and password=?`;
  connector.query(
    sql,
    [req.params.username, req.params.password],
    function (err, results) {
      if (err) {
        res.json(err);
      } else {
        if (results.length === 0) {
          req.session.isLoggedIn = 0;
          res.json({ status: 0, data: "incorrect login details" });
        } else {
          req.session.username = req.params.username;
          req.session.isLoggedIn = 1;
          res.json({ status: 1, data: req.params.username });
        }
      }
    }
  );
});
router.get("/loggedUser", function (req, res) {
  if (req.session.isLoggedIn === 1) {
    let sql = `select * from user where username=?`;
    connector.query(sql, [req.session.username], function (err, results) {
      if (err) {
        res.json(err);
      } else {
        res.json({ status: 1, data: results });
      }
    });
  } else {
    res.json({ status: 0, debug_data: "you are not logged in" });
  }
});
module.exports = router;
