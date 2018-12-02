//Event Listeners Go Here
console.log("events.js loaded")

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


$(".addUser").click( function() {

  console.log(".addUser clicked")

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
