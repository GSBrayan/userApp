const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const serverless = require("serverless-http");
const auth = require("./middleware/authentication");

const app = express();

app.post("/", async (req, res) => {
  const { name, lastName, lastName2, phone, email, username, password } =
    req.body;
  try {
    const newUser = await User.create({
      name,
      lastName,
      lastName2,
      phone,
      email,
      username,
      password,
    });
    res.json(newUser);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    console.log(e);
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

app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Ingresa su email y/o contraseña");
    }

    const user = await User.findOne({ email }).lean();

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
