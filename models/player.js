module.exports = function(sequelize, DataTypes) {
    var Player = sequelize.define("Player", {
      netWorth: {
          type: DataTypes.DECIMAL,
          allowNull: false
      }
        //other attr...
    });
  
    Player.associate = function(models) {
      Player.hasMany(models.Property, {
        onDelete: "cascade"
        //other...
      });
    };
  
    return Player;
  };