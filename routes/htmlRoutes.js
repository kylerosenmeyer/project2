const db = require("../models")

module.exports = function(app) {

  //*This Loads the Home Page, index.handlebars
  app.get("/", function(req, res) {
      res.render("index")
  })

  //*This Loads the Main App Page, app.handlebars
  app.get("/kitchen/:email", function(req, res) {

    let email = req.params.email
    // console.log("user: ",user)
      db.User.findOne(
        { where: { email: email }, include: [db.Ingredient, db.Recipe] }
        ).then(function(results) {

          // console.log("get results: ",results)
          
          //these exist in {{ in app. handlebars}}
          res.render("app", {
            user: email,
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
