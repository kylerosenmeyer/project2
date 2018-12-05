//*This is the model for the recipes table.
module.exports = function(sequelize, DataTypes) {

    //Define the Model
    let Recipe = sequelize.define("Recipe", {

        label: DataTypes.STRING,
        image: DataTypes.STRING,
        url: DataTypes.STRING,
        ingredients: DataTypes.JSON
        
    })
    // Associate recipes with the user
    Recipe.associate = function(models) {
       
        Recipe.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Recipe
}