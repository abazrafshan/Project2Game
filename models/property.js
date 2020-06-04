module.exports = function(sequelize, DataTypes) {
    var Property = sequelize.define("Property", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      owned: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
      }
      //other attr...
    },
    {
        freezeTableName: true,
    });
  
    Property.associate = function(models) {
      Post.belongsTo(models.Player, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Property;
  };
  