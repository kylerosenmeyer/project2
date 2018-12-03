//*This is the model for the ingredients table.
module.exports = function(sequelize, DataTypes) {

    //Defines the Model
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
    // Associate ingredients with the user
    Ingredient.associate = function(models) {
       
        Ingredient.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Ingredient
}