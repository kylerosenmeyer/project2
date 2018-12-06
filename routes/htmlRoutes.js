const db = require("../models")

module.exports = function(app) {

  //*This Loads the Home Page, index.handlebars
  app.get("/", function(req, res) {
      res.render("index")
  })

  //*This Loads the Main App Page, app.handlebars
  app.get("/kitchen/:email", function(req, res) {

    let email = req.params.email
    // console.log("email: ",email)

    let popularity = function(results) {

      db.Search.findAndCountAll({}).then(result => {
        
        console.log("total ingredients:",result.count)
        // console.log("search rows:",result.rows)

        let groupArray = [],
            array0 = [],
            w = window

        array0.push(rows[0].label)
        groupArray.push(array0)

        for ( let i=1; i<result.rows.length; i++ )  {

          if ( w["array"+i-1].includes( result.rows[i].label ) ) {
            w["array"+i-1].push( result.rows[i].label )
          } else { 
              w["array"+i] = []
              w["array"+i].push( result.rows[i].label )
              groupArray.push(w["array"+i])
          }
        }

        console.log("group array:",groupArray)
      })

      //these exist in {{ in app. handlebars}}
      res.render("app", {
        user: email,
        userID: results.id,
        Ingredient: results.Ingredients,
        Recipe: results.Recipes
      })
    }

    db.User.findOne(
      { where: { email: email }, include: [db.Ingredient, db.Recipe] }
      ).then(function(results) {

        // console.log("get results: ",results)
        popularity(results)
      })
  })

  //*This loads the Error Page, 404.handlebars
  app.get("*", function(req, res) {
    res.render("404")
  })
}
