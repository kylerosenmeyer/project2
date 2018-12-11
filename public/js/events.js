//Event Listeners Go Here
// console.log("events.js loaded")
//set a two arrays at the gloabl scope to be used later in dynamic events with the recipe results.
let ingredientStorage = [],
    userIngredients = []



//*--------------Event Listener for Toggling an Ingredient between "used" and "notused"--------------------------
$(".useIngredient").click( function() {

  let toggle = $(this).attr("data-use")

  if ( toggle === "true" ) {

    $(this).attr("data-use", "false")
           .removeClass("used")
           .addClass("notused")

  } else if ( toggle === "false" ) { 

    $(this).attr("data-use", "true")
           .removeClass("notused")
           .addClass("used")
  }
})





//*----------------------Event Listener for creating new users---------------------------------------
$(".loginBtn").click( function() {

  // console.log(".login clicked")

  let userName = $(".enterUser").val().trim(),
      email = $(".enterEmail").val().trim(),
      newUser = { name: userName, email: email },
      nextPage = "/kitchen/" + email

  // console.log("newUser:", newUser)
  //!ROUTE: Find or add user.
  $.ajax({
    url: "/api/users",
    method: "POST",
    data: newUser
    // this refreshes the page and makes the login button load the next page
    //!By changing the location to "nextPage", trigter another route.
  }).then( function() { location.href = nextPage } )
})






//*---------------------------Event Listener for adding an Ingredient------------------------------------
$(".addIngredient").click( function() {

  // console.log(".addIngredient clicked")

  let ingredientName = $(".newIngredient").val().trim(),
      userID = $("#userName").attr("data-userid"),
      newIngredient = { label: ingredientName, UserID: userID }

  // console.log("newIngredient:", newIngredient)
  //!ROUTE Add new ingredient
  $.ajax({
    url: "/api/add-ingredient/",
    method: "POST",
    data: newIngredient
    //!ROUTE: Reload current page.
  }).then( function() { location.reload() } )
})







//*---------------------------Event Listener for removing an Ingredient------------------------------------
$(".removeIngredient").click( function() {

  // console.log(".removeIngredient clicked")

  let ingredientID = $(this).attr("data-remove"),
      ingredientName = $("#"+ingredientID).text(),
      removeURL = "/api/remove-ingredient/" + ingredientName

  // console.log("ingredientID: ",ingredientID)
  // console.log("ingredientName: ",ingredientName)
  // console.log("removeUrl: ",removeURL)
  //!ROUTE: Delete Ingredient
  $.ajax({
    url: removeURL,
    method: "DELETE"
    //!ROUTE: Reload current page.
  }).then( function() { location.reload() } )
})







//*---------Event Listener for getting the recipes from the api.---------------------------
$(".getRecipes").click( function() {

  $(".apiRecipe").remove()
  userIngredients = []
  ingredientStorage = []


  // console.log(".getRecipes clicked")
  //Empty array where recipes will be stored
  let selections = [],
      userID = $("#userName").attr("data-userid")

  //Loop through all the ingredients and check whether they have been toggled or not.
  $(".ingredient").each( function() {

    let buttonClass = "." + $(this).attr("data-id"),
        matchedAttr = $(buttonClass).attr("data-use")
    
    // console.log("ingredient: " + buttonClass + ", matched " + matchedAttr)

    if ( matchedAttr === "true" ) {

      selections.push( $(this).text().trim().toLowerCase() )
    }
  })
  // console.log("selections:",selections)

  //Check to see if the user made any selections before doing any more work.
  if ( selections.length === 0 ) {
    $("#recipeResults").html("No ingredients were selected. Please select some ingredients to get recipes!")
  } else {

    $("#recipeResults").html("")

    let request = { cook: JSON.stringify(selections), title: "API Request", userID: userID }
    // console.log("request:",request)


    //Send Two AJAX requests, one to store the ingredients that were searched for and one for getting the recipes.
    //!ROUTE: Store user search.
    $.ajax({
      url: "/api/store-search/",
      method: "POST",
      data: request
    }).then( function(response) {
      // console.log("search stored!")
    })

    //!ROUTE: Trigger Recipe API.
    $.ajax({
      url: "/api/get-recipes/",
      method: "POST",
      data: request
    }).then( function (response) {
      //Take the api response and generate the dynamic cards that display the recipes.
      // console.log("api response: ",response)

      userIngredients = response[0]
      // console.log("user ingredients: ",userIngredients)

      for ( let i=1; i<response.length; i++ ) {

        let ingredientArray = response[i].ingredients,
            index = i-1,
            label = response[i].label,
            image = response[i].image,
            calories = response[i].calories,
            servings = response[i].servings,
            time = response[i].time,
            url = response[i].url,
            wrapper = $("<div>"),
            row = $("<div>"),
            bigColumn = $("<div>"),
            smallColumn = $("<div>"),
            img = $("<img>"),
            p = $("<p>"),
            saveButton = $("<button type=\"button\"><i class=\"fas fa-heart saveHeart\"></i></button>")
            
        

        ingredientStorage.push(ingredientArray)
        // console.log(ingredientStorage)
        
        //Build the list of recipe results dynamically
           wrapper.addClass("apiRecipe")
               row.addClass("labelRow")
         bigColumn.addClass("labelColumn")
       smallColumn.addClass("buttonColumn")
                 p.addClass("recipeLabel")
                  .attr("data-id", index)
                  .text(label)
              img.addClass("recipeImg openRecipe")
                  .attr("data-id", index)
                  .attr("src", image)
                  .attr("data-src", url)
                  .attr("data-calories", calories)
                  .attr("data-servings", servings)
                  .attr("data-time", time)
        saveButton.addClass("saveBtn saveRecipe notsaved")
                  .attr("data-saved", "false")
                  .attr("data-heart", index)


        bigColumn.append(p)
        smallColumn.append(saveButton)
        row.append(smallColumn, bigColumn)
        wrapper.append(img, row)
        $("#recipeResults").append(wrapper)  
      }


      //*------------------------------Add Event Listeners for saving a recipe (inside the get Recipes Callback)------------------------------------
      let hearts = document.getElementsByClassName("saveRecipe"),
          saveRecipe = function() {

            if ( $(this).attr("data-saved") === "false" ) {

              $(this).attr("data-saved", "true").removeClass("notsaved").addClass("saved")
                  
            } else if ( $(this).attr("data-saved") === "true" ) {

              $(this).attr("data-saved", "false").removeClass("saved").addClass("notsaved")
            } 
          }
      for ( let i=0; i<hearts.length; i++ ) {
        hearts[i].addEventListener("click", saveRecipe)
      }

      //*----------------------------Add Event Listeners for opening a recipe (inside the get Recipes Callback)------------------------------------
      let recipes = document.getElementsByClassName("openRecipe"),
          openRecipe = function() {

            let recipeID = $(this).attr("data-id"),
                url = $(this).attr("data-src"),
                calories = parseInt($(this).attr("data-calories")),
                servings = parseInt($(this).attr("data-servings")),
                time = parseInt($(this).attr("data-time")),
                title = $("p[data-id=" + recipeID + "]").text(),
                recipeImage = $("img[data-id=" + recipeID + "]").attr("src"),
                recipeIngredients = JSON.parse(JSON.stringify(ingredientStorage[recipeID])),
                ingredientList = "",
                counter = 0

            //Calculate the calories per serving and time for the recipe
            // console.log("calories:",calories, "servings:",servings, "time:",time, "minutes")

            calories = (calories/servings).toFixed(0)
            // console.log("calories/serving:",calories)

            if ( time === 0 ) { time = "Cooking Time Not Available. Check Recipe Website." } else { time = "Ready in " + time + " minutes."}

            //The Compare Ingredients using a recursive function.
            let compareIngredients = function() {
                if ( counter < recipeIngredients.length ) {

                  // console.log("user ingredient: ",userIngredients[counter])
                  // console.log("counter: ",counter)
      
                  for ( let i=0; i<recipeIngredients.length; i++ ) {

                    if ( recipeIngredients[i].includes( userIngredients[counter] ) ) {
    
                      ingredientList += "<li class=\"found\">" + recipeIngredients[i] + "</li>"
                      recipeIngredients.splice(i,1)
                    } 
                  } 
      
                  counter++
                  compareIngredients()
                }
            }
            //Start the recursive function.
            compareIngredients()

            for ( let i=0; i<recipeIngredients.length; i++ ) {

              ingredientList += "<li>" + recipeIngredients[i] + "</li>"
            }
            
            $(".modal-ingredients").html(ingredientList)
            $(".modal-title").html(title)
            $(".modal-image").attr("src", recipeImage)
            $(".modal-recipe").attr("data-src", url)
            $(".modal-calories").html(calories + " calories per serving, makes " + servings + " servings.")
            $(".modal-time").html(time)
            //Triggle Modal
            $("#recipeModal").modal("toggle")
            
          }
      for ( let i=0; i<hearts.length; i++ ) {
        recipes[i].addEventListener("click", openRecipe)
      }
    }).catch( function(error) { console.log(error.message) } ) 
  }
})





//*--------------------------------Event Listener for storing favorited recipes------------------------------
$(".storeRecipes").click( function() {
  
  let hearts = document.getElementsByClassName("saveRecipe"),
      recipeArray = [],
      userID = $("#userName").attr("data-userid")
  
  for ( let i=0; i< hearts.length; i++ ) {

    if ( hearts[i].getAttribute("data-saved") === "true" ) {
      
      let id = hearts[i].getAttribute("data-heart"),
          favorite = {
            label: $("p[data-id=" + id + "]").text(),
            image: $("img[data-id=" + id + "]").attr("src"),
            url: $("img[data-id=" + id + "]").attr("data-src"),
            servings: $("img[data-id=" + id + "]").attr("data-servings"),
            time: $("img[data-id=" + id + "]").attr("data-time"),
            calories: $("img[data-id=" + id + "]").attr("data-calories"),
            ingredients: ingredientStorage[id],
            UserID: userID
            
          }

      recipeArray.push(favorite)
    }
  }

  // console.log("recipeArray: ",recipeArray)

  //Check to see if the user made any selections before doing any more work.
  if ( recipeArray.length === 0 ) {
    $(".storeError").html("No recipes were selected. Please <i class=\"fas fa-heart\"></i> some recipes to store them!")
  } else { 

    $(".storeError").html("")

    let request = { save: JSON.stringify(recipeArray), title: "API Request" }
    // console.log(request)
    //!ROUTE: Save Recipes
    $.ajax({ url: "/api/store-recipe/",
            method: "POST",
            data: request
            //!ROUTE: Reload current page.
            }).then( (function() { location.reload() } ) )
  }
})











//*-----------------------------------Event Listener for removing a Recipe----------------------------------
$(".removeRecipe").click( function() {

  // console.log(".removeRecipe clicked")

  let recipeID = $(this).attr("data-remove"),
      recipeName = $("#"+recipeID).text(),
      removeURL = "/api/remove-recipe/" + recipeID

  // console.log("recipeID: ",recipeID)
  // console.log("recipeName: ",recipeName)
  // console.log("removeUrl: ",removeURL)
  $.ajax({
    url: removeURL,
    method: "DELETE"
  }).then( function() { location.reload() } )
})







//*-------------------------------Event Listener for opening a saved Recipe-------------------------------
$(".openSavedRecipe").click( function() {

  let recipeID = $(this).attr("data-id"),
      url = $(this).attr("data-src"),
      calories = parseInt($(this).attr("data-calories")),
      servings = parseInt($(this).attr("data-servings")),
      time = parseInt($(this).attr("data-time")),
      title = $("h5[data-id=" + recipeID + "]").text(),
      recipeImage = $("img[data-id=" + recipeID + "]").attr("src")

  //Calculate the calories per serving and time for the recipe
  // console.log("calories:",calories, "servings:",servings, "time:",time, "minutes")

  calories = (calories/servings).toFixed(0)
  // console.log("calories/serving:",calories)

  if ( time === 0 ) { time = "Cooking Time Not Available. Check Recipe Website." } else { time = "Ready in " + time + " minutes."}
  
  $.ajax({
    url: "/api/get-saved-ingredients/",
    method: "POST",
    data: { id: recipeID }
  }).then( function(response) {

    // console.log(response)
    let ingredientList = ""

    for ( let i=0; i<response.length; i++ ) {

      ingredientList += "<li>" + response[i] + "</li>"
    }
    
    $(".modal-ingredients").html(ingredientList)

    $(".modal-title").html(title)
    $(".modal-image").attr("src", recipeImage)
    $(".modal-recipe").attr("data-src", url)
    $(".modal-calories").html(calories + " calories per serving, makes " + servings + " servings.")
    $(".modal-time").html(time)
    //Triggle Modal
    $("#recipeModal").modal("toggle")

  })

  
})
      
          



//*-----------------------------------Event Listener for clicking the Open Recipe Button in a Modal--------------------------------------
$(".modal-recipe").click( function() {

  let url = $(this).attr("data-src")
  window.open( url, "_blank" )
})

$(".modal-close").click( function() {
  $(".modal-recipe").attr("data-src", " ")
})







//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$("#recipeModal").on("shown.bs.modal", function () { $("#recipeModal").trigger("focus") } )




