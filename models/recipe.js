//*This is the model for the recipes table.
module.exports = function(sequelize, DataTypes) {

    //Define the Model
    let Recipe = sequelize.define("Recipe", {

        label: DataTypes.STRING,
        image: DataTypes.STRING,
        url: DataTypes.STRING,
        calories: DataTypes.INTEGER,
        time: DataTypes.INTEGER,
        servings: DataTypes.INTEGER
    })

    // Associate recipes with the User and recipe ingredients with the Recipe
    Recipe.associate = function(models) {
       
        Recipe.belongsTo(models.User, { foreignKey: { allowNull: false } } )
        
        Recipe.hasMany(models.recipeIngredient, { onDelete: "cascade" } )  
    }
  
    return Recipe
}