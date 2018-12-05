//*This is the model for the saved ingredients table.
module.exports = function(sequelize, DataTypes) {

    //Defines the Model
    let recipeIngredient = sequelize.define("recipeIngredient", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 255] }
        }
    })
    // Associate recipe ingredients with the Recipe
    recipeIngredient.associate = function(models) {
       
        recipeIngredient.belongsTo(models.Recipe, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return recipeIngredient
}