module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 100] }
    }})

    User.associate = function(models) {
    
        User.hasMany( models.Ingredient, {
            onDelete: "cascade"
            }),
        User.hasMany( models.Recipe, {
            onDelete: "cascade"
        })
    }

    return User
}