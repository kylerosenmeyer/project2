const 
    db = require("../models"),
    axios = require("axios")

module.exports = function(app) {
  
  //*This is the route to either add or find a User
  app.post("/api/users", function(req, res) {

    let data = req.body
    console.log(data)

    db.User.findOrCreate( { where: { name: data.name, email: data.email } }
    
      ).then( function(result) {
      res.json(result)
    })
  })

  //*This is the route to add an Ingredient to a User's list
  app.post("/api/add-ingredient/", function(req, res) {

    let data = req.body

    db.Ingredient.create({ label: data.label,
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

  //*This is the route to get the recipes from the api
  app.post("/api/get-recipes/", function(req, res) {

    //Build the api query. First build the q parameter
    let data = JSON.parse(req.body.cook),
        q = "q=",
        recipeArray = [],
        userIngredients = []

    console.log("\nincoming array: ",data)


    for ( let i=0; i<data.length; i++ ) {

      if ( i < (data.length - 1) ) {
        q += data[i] + "+"
        userIngredients.push(data[i])
      } else { 
        q += data[i]
        userIngredients.push(data[i])
      } 
    }

    recipeArray.push(userIngredients)
    console.log("first stage recipeArray: ",recipeArray)

    console.log("\nq:",q)
    //At this point the q parameter is constructed. Now build the rest of the api query.

    let appID = "8417f32f",
        appKey = "cdc0b36554522a88a0242b7ea30e9837",
        query = "https://api.edamam.com/search?" + q + "&app_id=" + appID + "&app_key=" + appKey + "&from=0&to=5"

    console.log("query:",query)

    //Make the API Call
    axios.get(query)
         .then( function(response) { 

            let Recipe = response.data.hits
                

            for ( let i=0; i<Recipe.length; i++ ) {

              console.log("\n")
              console.log(Recipe[i].recipe.label)
              console.log(Recipe[i].recipe.image)
              console.log(Recipe[i].recipe.url)
              console.log(Recipe[i].recipe.ingredientLines)
              console.log(Recipe[i].recipe.calories)
              console.log(Recipe[i].recipe.yield)
              console.log(Recipe[i].recipe.totalTime)
              console.log("\n")

              let recipe = { label: Recipe[i].recipe.label,
                             image: Recipe[i].recipe.image,
                             url: Recipe[i].recipe.url,
                             ingredients: Recipe[i].recipe.ingredientLines,
                             calories: Recipe[i].recipe.calories,
                             servings: Recipe[i].recipe.yield,
                             time: Recipe[i].recipe.totalTime
                            }

              recipeArray.push(recipe)              
            }
            res.send(recipeArray)
          }).catch( function (error) { console.log(error) } )
  })

  //*This is the route to store the ingredients searched by the user.
  app.post("/api/store-search/", function(req, res) {

    let data = JSON.parse(req.body.cook)

    console.log("data: ", data)
    console.log("userID: ",req.body.userID)

    function storeSearch(data) {
      for ( let i=0; i<data.length; i++ ) {

        db.Search.create({ label: data[i],
                           UserId: req.body.userID
                          })
      }
    }
    storeSearch(data)
    res.send("search stored!")
  })

  //*This is the route to store a Recipe to the User's list
  app.post("/api/store-recipe/", function(req, res) {

    let data = JSON.parse(req.body.save)
    console.log("data: ",data)

    //!This function is not working. Research Sequelize transactions.
    function storeFavorites(data) {
      for ( let i=0; i<data.length; i++ ) {

        return sequelize.transaction(function (e) {

          return db.Recipe.create({ label: data[i].label,
                                    image: data[i].image,
                                    url: data[i].url,
                                    UserId: data[i].UserID,
                                    calories: data[i].calories,
                                    time: data[i].time,
                                    servings: data[i].servings
          }, {transaction: e}).then(function (recipe) {

            for ( let j=0; j< data[i].ingredients.length; j++ ) {

              return recipe.db.recipeIngredient( { label: data[i].ingredients[j] }, { transaction: e } )
              
            }
          })

        }).then(function (result) {
          
        }).catch(function (err) {
          console.log(err)
        })
        
      }
    }

    storeFavorites(data)
    res.end()
  })

  //*This is the route to remove a Recipe from a User's List
  app.delete("/api/remove-recipe/:recipe", function(req, res) {

    let recipe = req.params.recipe

    db.Recipe.destroy({ where: { label: recipe } 
                      } 
                      ).then( function(result) { 
                        res.json(result) 
                      })
  })
}
