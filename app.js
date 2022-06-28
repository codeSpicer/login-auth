// NPM MODULES ----------------------------------------------------------->
let express = require("express");
let ejs = require("ejs");

// USING MODULES---------------------------------------------------------->

let app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// LISTENING TO SERVER--------------------------------------------------------------->
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
