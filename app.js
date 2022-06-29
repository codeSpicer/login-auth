// NPM MODULES ----------------------------------------------------------->
let express = require("express");
let ejs = require("ejs");
let mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
require("dotenv").config();

// USING MODULES---------------------------------------------------------->

let app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
mongoose.connect(
  `mongodb+srv://${process.env.MONGO}@cluster0.zeuj48k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

var encKey = process.env.ENCRYPTION_KEY;
var sigKey = process.env.DECRYPTION_KEY;

const userSchema = new mongoose.Schema({ email: String, password: String });

userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ["password"],
}); // packs in extra bits of data

const User = new mongoose.model("User", userSchema);

// LISTENING TO SERVER--------------------------------------------------------------->
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

// ROUTES--------------------------------------------------------------------------->

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
            return;
          }
        }
      }
      res.render("home");
    });
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res, next) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

// app.route("/secrets").get((req, res) => {
//   res.render("secrets");
// });

app.route("submit").get((req, res) => {
  res.render("submit");
});
