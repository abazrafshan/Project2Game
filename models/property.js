module.exports = function(sequelize, DataTypes) {
    var Property = sequelize.define("Property", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
        },
        payout: {
            type: DataTypes.INTEGER,
        },
        owned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    });
  
    Property.associate = function(models) {
      Property.belongsTo(models.Player, {
        foreignKey: {
          allowNull: false,
          defaultValue: 3
        }
      });
    };
  
    return Property;
  };
  