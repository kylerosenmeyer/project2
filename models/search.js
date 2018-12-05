//*This is the model for the ingredients table.
module.exports = function(sequelize, DataTypes) {

    //Defines the Model
    let Search = sequelize.define("Search", {
        label: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 40] }
        }
    })
    // Associate searches with the User
    Search.associate = function(models) {
       
        Search.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        })
    }
  
    return Search
}