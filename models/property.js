module.exports = function(sequelize, DataTypes) {
    var Property = sequelize.define("Property", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        payout: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        owned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
    });
  
    Property.associate = function(models) {
      Property.belongsTo(models.Player, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Property;
  };
  