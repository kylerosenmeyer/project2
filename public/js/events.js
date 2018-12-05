//Event Listeners Go Here
console.log("events.js loaded")
//set a two arrays at the gloabl scope to be used later in dynamic events with the recipe results.
let ingredientStorage = [],
    userIngredients = []

//*Event Listener for Toggling an Ingredient between "used" and "notused"
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

//*Event Listener for creating new users
$(".login").click( function() {

  console.log(".login clicked")

  let userName = $(".enterUser").val().trim(),
      email = $(".enterEmail").val().trim(),
      newUser = { name: userName, email: email },
      nextPage = "/kitchen/" + email

  console.log("newUser:", newUser)
  $.ajax({
    url: "/api/users",
    method: "POST",
    data: newUser
    // this refreshes the page and makes the login button load the next page
  }).then( function() { location.href = nextPage } )
})

//*Event Listener for adding an Ingredient
$(".addIngredient").click( function() {

  console.log(".addIngredient clicked")

  let ingredientName = $(".newIngredient").val().trim(),
      userID = $("#userName").attr("data-userid"),
      newIngredient = { label: ingredientName, UserID: userID }

  console.log("newIngredient:", newIngredient)
  $.ajax({
    url: "/api/add-ingredient/",
    method: "POST",
    data: newIngredient
  }).then( function() { location.reload() } )
})

//*Event Listener for removing an Ingredient
$(".removeIngredient").click( function() {

  console.log(".removeIngredient clicked")

  let ingredientID = $(this).attr("data-remove"),
      ingredientName = $("#"+ingredientID).text(),
      removeURL = "/api/remove-ingredient/" + ingredientName

  console.log("ingredientID: ",ingredientID)
  console.log("ingredientName: ",ingredientName)
  console.log("removeUrl: ",removeURL)
  $.ajax({
    url: removeURL,
    method: "DELETE"
  }).then( function() { location.reload() } )
})

//*Event Listener for getting the recipes from the api.
$(".getRecipes").click( function() {

  $(".apiRecipe").remove()
  userIngredients = []
  ingredientStorage = []

  console.log(".getRecipes clicked")
  //Empty array where recipes will be stored
  let selections = [],
      userID = $("#userName").attr("data-userid")

  $(".ingredient").each( function() {

    let buttonClass = "." + $(this).attr("data-id"),
        matchedAttr = $(buttonClass).attr("data-use")
    
    console.log("ingredient: " + buttonClass + ", matched " + matchedAttr)

    if ( matchedAttr === "true" ) {

      selections.push( $(this).text().toLowerCase() )
    }
  })
  console.log("selections:",selections)

  let request = { cook: JSON.stringify(selections), title: "API Request", userID: userID }
  console.log("request:",request)
  
  $.ajax({
    url: "/api/store-search/",
    method: "POST",
    data: request
  }).then( function(response) {
    console.log("search stored!")
  })

  $.ajax({
    url: "/api/get-recipes/",
    method: "POST",
    data: request
  }).then( function (response) {

    console.log("api response: ",response)

    userIngredients = response[0]
    console.log("user ingredients: ",userIngredients)

    for ( let i=1; i<response.length; i++ ) {

      let ingredientArray = response[i].ingredients,
          index = i-1
          
      ingredientStorage.push(ingredientArray)
    

      console.log(ingredientStorage)
  
      let wrapper = $("<div>")
      wrapper.addClass("apiRecipe")
      wrapper.append("<p data-id=\"" + index + "\" class=\"recipeLabel\">" + response[i].label + "</p>")
      wrapper.append("<img data-id=\"" + index + "\" class=\"recipeImg\" src=\"" + response[i].image + "\">")
      wrapper.append("<button data-id=\"" + index + "\" class=\"openRecipe\" type=\"button\" data-src=\"" + response[i].url + "\"> Open Recipe </a>")
      wrapper.append("<button data-id=\"" + index + "\" data-saved=\"false\" type=\"button\" class=\"saveRecipe saveBtn notsaved\"><i class=\"fas fa-heart\"></i></button>")
      $("#recipeResults").append(wrapper)  
    }


    //*Event Listener for saving a recipe
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

    //*Event Listener for opening a recipe
    let recipes = document.getElementsByClassName("openRecipe"),
        openRecipe = function() {

          let recipeID = $(this).attr("data-id"),
              url = $(this).attr("data-src"),
              title = $("p[data-id=" + recipeID + "]").text(),
              recipeImage = $("img[data-id=" + recipeID + "]").attr("src"),
              recipeIngredients = ingredientStorage[recipeID],
              ingredientList = "",
              counter = 0

          let compareIngredients = function() {
              if ( counter < recipeIngredients.length ) {

                console.log("user ingredient: ",userIngredients[counter])
                console.log("counter: ",counter)
    
                for ( let i=0; i<recipeIngredients.length; i++ ) {

                  if ( recipeIngredients[i].includes( userIngredients[counter] ) ) {
  
                    ingredientList += "<li class=\"green\">" + recipeIngredients[i] + "</li>"
                    recipeIngredients.splice(i,1)
                  } 
                } 
    
                counter++
                compareIngredients()
              }
          }

          compareIngredients()

          for ( let i=0; i<recipeIngredients.length; i++ ) {

            ingredientList += "<li>" + recipeIngredients[i] + "</li>"
          }
          
          $(".modal-ingredients").html(ingredientList)
          $(".modal-title").html(title)
          $(".modal-image").attr("src", recipeImage)
          $(".modal-recipe").attr("data-src", url)
          //Triggle Modal
          $("#recipeModal").modal("toggle")
          
        }
    for ( let i=0; i<hearts.length; i++ ) {
      recipes[i].addEventListener("click", openRecipe)
    }
   }).catch( function(error) { console.log(error.message) } ) 
})

//*Event Listener for storing favorited recipes
$(".storeRecipes").click( function() {

  let hearts = document.getElementsByClassName("saveRecipe"),
      recipeArray = [],
      userID = $("#userName").attr("data-userid")
  
  for ( let i=0; i< hearts.length; i++ ) {

    if ( hearts[i].getAttribute("data-saved") === "true" ) {
      
      let id = hearts[i].getAttribute("data-id"),
          favorite = {
            label: $("p[data-id=" + id + "]").text(),
            image: $("img[data-id=" + id + "]").attr("src"),
            url: $("a[data-id=" + id + "]").attr("href"),
            ingredients: ingredientStorage[id][i],
            UserID: userID
          }

      recipeArray.push(favorite)
    }
  }

  console.log("recipeArray: ",recipeArray)

  let request = { save: JSON.stringify(recipeArray), title: "API Request" }
  console.log(request)

  $.ajax({ url: "/api/store-recipe/",
           method: "POST",
           data: request
          }).then( (function() { 
            location.reload() 
          } ) )
})

//*Event Listener for removing a Recipe
$(".removeRecipe").click( function() {

  console.log(".removeRecipe clicked")

  let recipeID = $(this).attr("data-remove"),
      recipeName = $("#"+recipeID).text(),
      removeURL = "/api/remove-recipe/" + recipeName

  console.log("recipeID: ",recipeID)
  console.log("recipeName: ",recipeName)
  console.log("removeUrl: ",removeURL)
  $.ajax({
    url: removeURL,
    method: "DELETE"
  }).then( function() { location.reload() } )
})

//*Event Listener for opening a saved Recipe
$(".openSavedRecipe").click( function() {

  let recipeID = $(this).attr("data-id"),
      url = $(this).attr("data-src"),
      title = $("h5[data-id=" + recipeID + "]").text(),
      recipeImage = $("img[data-id=" + recipeID + "]").attr("src")

  $(".modal-title").html(title)
  $(".modal-image").attr("src", recipeImage)
  $(".modal-recipe").attr("data-src", url)
  //Triggle Modal
  $("#recipeModal").modal("toggle")
})
      
          

$(".modal-recipe").click( function() {

  let url = $(this).attr("data-src")
  window.open( url, "_blank" )
})

$(".modal-close").click( function() {
  $(".modal-recipe").attr("data-src", " ")
})


//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$("#recipeModal").on("shown.bs.modal", function () { $("#recipeModal").trigger("focus") } )




