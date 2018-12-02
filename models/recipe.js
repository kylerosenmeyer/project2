module.exports = function(sequelize, DataTypes) {

    let Recipe = sequelize.define("Recipe", {

        label: DataTypes.STRING,
        image: DataTypes.STRING,
        url: DataTypes.STRING
    })
  
    Recipe.associate = function(db) {
       
        Recipe.belongsTo(db.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Recipe
}