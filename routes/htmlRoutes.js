var db = require("../models")

module.exports = function(app) {
  app.get("/", function(req, res) {
      res.render("index")
  })

  app.get("/kitchen/:user", function(req, res) {
      db.User.findAll(
        { where: { name: req.params.user }, include: [db.Ingredient, db.Recipe] }
        ).then(function(results) {
          res.render("app", {
            Ingredient: results
          })
        })
  })

  app.get("*", function(req, res) {
    res.render("404")
  })
}
