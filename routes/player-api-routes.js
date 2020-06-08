var db = require("../models");

module.exports = function(app) {
  //GET route to get all players
  app.get("/api/players", function(req, res) {
    db.Player.findAll({
      include: [db.Property]
    }).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

  //GET route to get a speciic player
  app.get("/api/players/:id", function(req, res) {
    db.Player.findOne({ 
      where: {
        id: req.params.id
      },
      include: [db.Property]
    }).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });
  
  // PUT route for updating a player
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

  // POST route for creating a new player
  app.post("/api/player", function(req, res) {
    db.Player.create(req.body).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

};
