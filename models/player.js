module.exports = function(sequelize, DataTypes) {
    var Player = sequelize.define("Player", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        money: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 1500
        },
        currentSpace: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 16
        }
    },
    {timestamps: false
    });
  
    Player.associate = function(models) {
      Player.hasMany(models.Property, {
        onDelete: "cascade"
      });
    };
  
    return Player;
  };