var db = require("../models");

module.exports = function(app) {
  
  app.post("/api/users/", function(req, res) {

    let data = req.body
    console.log(data)

    db.User.create({

      name: data.name
    }, { include: [db.Ingredient, db.Recipe] }).then( function(result) {

      res.json(result)

    })
  })

  app.get("api/users/", function(req, res) {

    let data = req.body
    console.log(data)

    db.User.create({

      name: data.name
    }, { include: [db.Ingredient, db.Recipe] }).then( function(result) {

      res.json(result)

    })
  })

  app.post("/api/add-ingredient/", function(req, res) {

    let data = req.body
    console.log(data)

    db.Ingredient.create({

      label: data.label
    }, { include: [db.User] }).then( function(result) {

      res.json(result)

    })
  })
}
