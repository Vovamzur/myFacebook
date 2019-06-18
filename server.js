const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const passport = require("passport");

const users = require("./routes/api/users");
const groups = require('./routes/api/groups');

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//const db = require("./config/keys").mongoURI;
const db = 'mongodb://localhost:27017/lab5';

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);

app.use(passport.initialize());
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use('/api/groups', groups);

const port = process.env.PORT || 5000;
app.listen(port);