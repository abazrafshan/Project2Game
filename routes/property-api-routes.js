var db = require("../models");

module.exports = function(app) {
  // GET route for getting all of the property
  app.get("/api/property", function(req, res) {
    var query = {};
    if (req.query.player_id) {
      query.PlayerId = req.query.player_id;
    }
    db.Property.findAll({
      where: query,
      include: [db.Player]
    }).then(function(dbProperty) {
      res.json(dbProperty);
    });
  });

  // Get route for retrieving a single Property
  app.get("/api/property/:id", function(req, res) {
    db.Property.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Player]
    }).then(function(dbProperty) {
      console.log(dbProperty);
      res.json(dbProperty);
    });
  });

  // PUT route for updating property
  app.put("/api/property", function(req, res) {
    db.Property.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbProperty) {
      res.json(dbProperty);
    });
  });

  // POST route for creating a new property
  app.post("/api/property", function(req, res) {
    db.Property.create(req.body).then(function(dbProperty) {
      res.json(dbProperty);
    });
  });
};
