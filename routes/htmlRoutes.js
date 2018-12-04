const db = require("../models")

module.exports = function(app) {

  //*This Loads the Home Page, index.handlebars
  app.get("/", function(req, res) {
      res.render("index")
  })

  //*This Loads the Main App Page, app.handlebars
  app.get("/kitchen/:user", function(req, res) {

    let user = req.params.user
    // console.log("user: ",user)
      db.User.findOne(
        { where: { name: user }, include: [db.Ingredient, db.Recipe] }
        ).then(function(results) {

          // console.log("ingredients: ",results.Ingredients)
          
          //these exist in {{ in app. handlebars}}
          res.render("app", {
            user: user,
            userID: results.id,
            Ingredient: results.Ingredients,
            Recipe: results.Recipes
          })
        })
  })

  //*This loads the Error Page, 404.handlebars
  app.get("*", function(req, res) {
    res.render("404")
  })
}
