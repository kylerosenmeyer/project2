require("dotenv").config()
const 
    express = require("express"),
    handlebars = require("express-handlebars"),
    db = require("./models"),
    app = express(),
    PORT = process.env.PORT || 3000,
    apiRoutes = require("./routes/apiRoutes.js"),
    htmlRoutes = require("./routes/htmlRoutes.js")

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))

// Handlebars
app.engine("handlebars", handlebars( { defaultLayout: "main" } ) )
app.set("view engine", "handlebars")

// Routes
apiRoutes(app)
htmlRoutes(app)

let syncOptions = { force: false }

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    )
  })
})

module.exports = app
