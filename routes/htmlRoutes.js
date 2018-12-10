const db = require("../models")

module.exports = function(app) {

  //Define the errorPage function in export global scope to call it from multipe routes.
  let errorPage = function(res) {
    res.render("error404")
  }

  //*This Loads the Home Page, index.handlebars
  app.get("/", function(req, res) {
      res.render("index")
  })

  //*This Loads the Main App Page, app.handlebars
  app.get("/kitchen/:email", function(req, res) {

    //valideEmail is a function taken from stackOverflow.
    let email = req.params.email,
        sortedIngredients = [],
        topIngredients = [],
        validate = function(email) {
          let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return re.test(email);
        }
    
    //Check if the email paramater is valid before doing anymore work. If True, display the rest of the app.handlebars page. If false, display the error page.
    if ( validate(email) ) {

    
    
      // console.log("email: ",email)
      //Popularity is a function to get the searches out of the database and count/organize them.
      let popularity = function(results) {

        let userName = results.name
        // console.log("username:",userName)

        db.Search.findAndCountAll({}).then(result => {
          
          let groupArray = [],
              initialArray = [],
              toggle = false

          // console.log("result:",result)
          
          if ( result.count > 0 ) {

          

            initialArray.push(result.rows[0].label)
            topIngredients.push({total: result.count})
            groupArray.push(initialArray)

            // console.log("groupArray:",groupArray)

            for ( let i=1; i<result.rows.length; i++ )  {

              for ( let j=0; j<groupArray.length; j++ ) {
                
                if ( groupArray[j].includes( result.rows[i].label ) ) {

                  // console.log("found:",result.rows[i].label)
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
                  // console.log("new:",result.rows[i].label)
              }
            }

            sortedIngredients = groupArray
            // console.log("sorted ingredients:",sortedIngredients)

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
            // console.log("\n")
            // console.log("top ingredients:",topIngredients)
            // console.log("\n")
            topIngredients.splice(0,1)
          }
            // console.log("\n")
            // console.log("group array:",groupArray)
            // console.log("\n")

          }).then( function() {        

            // console.log("results:recipes:",results.Recipes)
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

    } else { errorPage(res) }

    
  })

  //*This loads the Error Page, 404.handlebars
  app.get("*", function(req, res) {

    errorPage(res)

  })
}
