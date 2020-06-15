var path = require("path");
var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    })
    app.get("/game", function(req, res) {
        db.sequelize.sync({force:true}).then(function() {
            db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            db.sequelize.query('DELETE FROM Property WHERE ID > 0');
            db.sequelize.query('ALTER TABLE Property AUTO_INCREMENT = 1');
            db.sequelize.query('DELETE FROM Players WHERE ID > 0');
            db.sequelize.query('ALTER TABLE Players AUTO_INCREMENT = 1');
            db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            db.sequelize.query('INSERT INTO Players (name) VALUES ("Player 1")');
            db.sequelize.query('INSERT INTO Players (name) VALUES ("Player 2")');
            db.sequelize.query('INSERT INTO Players (name, money) VALUES ("Bank", 1000000000)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Silver Ridge Ave", 100, 20)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Hollywood Bowl", 120, 24)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Glendower Avenue", 140, 28)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Route 66", 160, 32)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("San Pasqual Street", 180, 36)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Santa Anita Park", 200, 40)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Madison Avenue", 220, 44)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Gridlock", 240, 48)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Louise Avenue", 260, 52)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Universal Studios", 280, 56)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Sunswept Drive", 300, 60)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Getty Center", 320, 64)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Dell Avenue", 340, 68)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Santa Monica Pier", 360, 72)');
            db.sequelize.query('INSERT INTO Property (name, price, payout) VALUES ("Murphy Way", 380, 76)');
            db.sequelize.query('INSERT INTO Property (name) VALUES ("Collect Your Rent")');
        })
        res.sendFile(path.join(__dirname, "../public/game.html"));
    })
}