const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const bodyparser = require("body-parser");
const serverless = require("serverless-http");
const auth = require("./middleware/authentication");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const validateLength = (data) => {
  const { name, lastName, lastName2, phone, email, username, password } = data;

  let validExpression =
    name.length <= 40 &&
    lastName.length <= 40 &&
    lastName2.length <= 40 &&
    phone.length <= 10 &&
    email.length <= 40 &&
    username.length <= 30 &&
    password.length <= 20
      ? true
      : false;

  return validExpression;
};

app.post("/", async (req, res) => {
  const { name, lastName, lastName2, phone, email, username, password } =
    req.body;

  try {
    let newUser = new User();
    newUser.name = name;
    newUser.lastName = lastName;
    newUser.lastName2 = lastName2;
    newUser.password = password;
    newUser.email = email;
    newUser.username = username;
    newUser.phone = phone;

    if (
      name &&
      lastName &&
      phone &&
      password &&
      username &&
      validateLength(req.body)
    ) {
      newUser.save(function (err, user) {
        if (err) res.status(500).send("Save Failed");

        res.json(user);
      });
    } else {
      res.status(500).send("Please fill in all fields");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userVerify, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Ingresa su email y/o contraseña");
    }

    const phoneUser = await User.findOne({ email }).lean();
    const emailUser = await User.findOne({ phone }).lean();

    const user = phoneUser ? phoneUser : emailUser;

    if (user && password === user.password) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.json(user);
    } else {
      res.status(400).send("Error de inicio de sesion");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/check", auth, (req, res) => {
  res.status(200).send("TOKEN OKAY");
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});

module.exports.handler = serverless(app);
