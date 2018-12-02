//Event Listeners Go Here
console.log("index.js loaded")

$(".addUser").click( function() {

  console.log(".addUser clicked")

  let newUser = { name: $(".enterUser").val().trim() }

  console.log("newUser:", newUser)
  $.ajax({
    url: "/api/users/",
    method: "POST",
    data: newUser
  }).then( function() { location.reload()})
})

$(".addIngredient").click( function() {

  console.log(".addIngredient clicked")

  let newIngredient = { label: $(".newIngredient").val().trim() }

  console.log("newUser:", newIngredient)
  $.ajax({
    url: "/api/add-ingredient/",
    method: "POST",
    data: newIngredient
  }).then( function() { location.reload() } )
})
