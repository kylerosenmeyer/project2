module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 100] }
    }})

    User.associate = function(db) {
    
        User.hasMany(db.Ingredient, {
            onDelete: "cascade"
            })
    }

    User.associate = function(db) {
    
        User.hasMany(db.Recipe, {
            onDelete: "cascade"
            })
    }

    return User
}