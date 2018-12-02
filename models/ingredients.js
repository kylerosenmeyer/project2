module.exports = function(sequelize, DataTypes) {

    let Ingredient = sequelize.define("Ingredient", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 40] }
        },  
        used: {
            type: DataTypes.BOOLEAN,
            default: true
        }
    })
  
    Ingredient.associate = function(db) {
       
        Ingredient.belongsTo(db.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Ingredient
}