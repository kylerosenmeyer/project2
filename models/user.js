//*This is the model for the users table.
module.exports = function(sequelize, DataTypes) {
    
    //Defines the Model
    let User = sequelize.define("User", {
           name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 100] }

        }, email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isEmail: true}
        }})

    // Associating users to ingredients and recipes
    User.associate = function(models) {
        // When a user is deleted, also delete any associated ingredients  
        User.hasMany( models.Ingredient, {
            onDelete: "cascade"
            }),
        // When a user is deleted, also delete any associated recipes 
        User.hasMany( models.Recipe, {
            onDelete: "cascade"
        })
    }

    return User
}