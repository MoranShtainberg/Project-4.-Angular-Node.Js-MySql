const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "supermarket_project_2",
  timezone:'Z'
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mySql");
  }
});

const myQuery = (q) => {
  return new Promise((resolve, rejcet) => {
    con.query(q, (err, results) => {
      if (err) {
        rejcet(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { myQuery };