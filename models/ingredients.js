module.exports = function(sequelize, DataTypes) {

    let Ingredient = sequelize.define("Ingredient", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 40] }
        },  
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
  // Associating ingredients with each user
    Ingredient.associate = function(models) {
        
        Ingredient.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Ingredient
}