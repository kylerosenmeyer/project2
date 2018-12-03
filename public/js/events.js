//Event Listeners Go Here
console.log("events.js loaded")

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

//*Event Listener for Toggling an Ingredient between "used" and "notused"
$(".login").click( function() {

  console.log(".login clicked")

  let userName = $(".enterUser").val().trim(),
      newUser = { name: userName },
      nextPage = "/kitchen/" + userName

  console.log("newUser:", newUser)
  $.ajax({
    url: "/api/users",
    method: "POST",
    data: newUser
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

  console.log(".getRecipes clicked")

  let selections = []

  $(".ingredient").each( function() {

    let buttonClass = "." + $(this).attr("data-id"),
        matchedAttr = $(buttonClass).attr("data-use")
    
    console.log("ingredient: " + buttonClass + ", matched " + matchedAttr)

    if ( matchedAttr === "true" ) {

      selections.push( $(this).text() )
    }
  })
  console.log(selections)

  let request = { cook: JSON.stringify(selections), title: "API Request" }
  console.log(request)

  $.ajax({
    url: "/api/get-recipes/",
    method: "POST",
    data: request
  }).then( function(response) { 

    console.log(response)

    for ( let i=0; i<response.length; i++ ) {

      let wrapper = $("<div>")
      wrapper.addClass("apiRecipe")
      wrapper.append("<p data-id=\"" + i + "\" class=\"recipeLabel\">" + response[i].label + "</p>")
      wrapper.append("<img data-id=\"" + i + "\" class=\"recipeImg\" src=\"" + response[i].image + "\">")
      wrapper.append("<a data-id=\"" + i + "\" class=\"recipeLink\" target=\"blank\" href=\"" + response[i].url + "\"> Cook This Recipe </a>")
      wrapper.append("<button data-id=\"" + i + "\" data-saved=\"false\" type=\"button\" class=\"saveRecipe saveBtn notsaved\"><i class=\"fas fa-heart\"></i></button>")
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
   })
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
            UserID: userID
          }
      recipeArray.push(favorite)
    }
  }

  console.log("recipeArray: ",recipeArray)

  let request = { save: JSON.stringify(recipeArray), title: "API Request" }
  console.log(request)

  $.ajax({
            url: "/api/store-recipe/",
            method: "POST",
            data: request
          }).then( (function() { location.reload() } ) )
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
$(".openRecipe").click( function() {
  let url = $(this).attr("data-src")
  
  window.open( url, '_blank')
})



