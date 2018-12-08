const db = require("../models")

module.exports = function(app) {

  //*This Loads the Home Page, index.handlebars
  app.get("/", function(req, res) {
      res.render("index")
  })

  //*This Loads the Main App Page, app.handlebars
  app.get("/kitchen/:email", function(req, res) {

    let email = req.params.email,
        sortedIngredients = [],
        topIngredients = []
    // console.log("email: ",email)
    //Popularity is a function to get the searches out of the database and count/organize them.
    let popularity = function(results) {

      let userName = results.name
      console.log("username:",userName)

      db.Search.findAndCountAll({}).then(result => {
        
        let groupArray = [],
            initialArray = [],
            toggle = false

        initialArray.push(result.rows[0].label)
        topIngredients.push({total: result.count})
        groupArray.push(initialArray)

        for ( let i=1; i<result.rows.length; i++ )  {

          for ( let j=0; j<groupArray.length; j++ ) {
            
            if ( groupArray[j].includes( result.rows[i].label ) ) {

              groupArray[j].push(result.rows[i].label)
              toggle = true
            } 
          }

          if ( toggle == true ) { 
            
            toggle = false
          } else {

            let newArray = []
            newArray.push(result.rows[i].label)
            groupArray.push(newArray)
            sortedIngredients = groupArray
          }
        }
        // console.log("\n")
        // console.log("group array:",groupArray)
        // console.log("\n")

      }).then( function() {        

        //Now prepare the the most popular ingredients data to send to the page.
        let ingredientScores = []

        for ( let k=0; k<sortedIngredients.length; k++ ) {

          ingredientScores.push(sortedIngredients[k].length)
          // console.log("scores: ",ingredientScores)
        }

        for ( let m=0; m<4; m++ ) {

          let max = Math.max(...ingredientScores),
              index = ingredientScores.indexOf(max),
              percentage = (((max/topIngredients[0].total)*100).toFixed(0) + "%" ),
              winner = { percent: percentage, count: max, label: sortedIngredients[index][0] }
        
          topIngredients.push(winner)
          ingredientScores.splice(index,1,0)
        }
        console.log("\n")
        console.log("top ingredients:",topIngredients)
        console.log("\n")
        topIngredients.splice(0,1)
        //these exist in {{ in app. handlebars}}
        res.render("app", {
          user: userName,
          userID: results.id,
          Ingredient: results.Ingredients,
          Recipe: results.Recipes,
          Popular: topIngredients
        })
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
