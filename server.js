var express = require("express");
var compression = require("compression");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(compression());
// Static directory
app.use(express.static("public"));

// Routes
require("./routes/player-api-routes.js")(app);
require("./routes/property-api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({force:true}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});