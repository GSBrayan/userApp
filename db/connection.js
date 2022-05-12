const mongoose = require("mongoose");

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const uri = `mongodb+srv://bGonzalez:Welcome2022@cluster0.ta7al.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connection = mongoose
  .connect(uri, connectionParams)
  .then((data) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

module.exports = connection;
