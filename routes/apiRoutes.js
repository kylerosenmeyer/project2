const db = require("../models")

module.exports = function(app) {
  
  //*This is the route to either add or find a User
  app.post("/api/users", function(req, res) {

    let data = req.body
    // console.log(data)

    db.User.findOrCreate( { where: { name: data.name } }
    
      ).then( function(result) {
      res.json(result)
    })
  })

  //*This is the route to add an Ingredient to a User's list
  app.post("/api/add-ingredient/", function(req, res) {

    let data = req.body

    db.Ingredient.create({
                            label: data.label,
                            UserId: data.UserID
                          }
                          ).then( function(result) {
                            res.json(result)
                          })
  })

  //*This is the route to remove an Ingredient from a User's List
  app.delete("/api/remove-ingredient/:ingredient", function(req, res) {

    let ingredient = req.params.ingredient

    db.Ingredient.destroy({ 
                            where: { label: ingredient } 
                          } 
                          ).then( function(result) { 
                            res.json(result) 
                          })
  })
}
