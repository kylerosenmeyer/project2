// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
require("dotenv").config()

const 
    express = require("express"),
    handlebars = require("express-handlebars"),
    // Requiring our models for syncing
    db = require("./models"),
    // Sets up the Express App
    app = express(),
    PORT = process.env.PORT || 3000,
    // Import routes and give the server access to them.
    apiRoutes = require("./routes/apiRoutes.js"),
    htmlRoutes = require("./routes/htmlRoutes.js")

// Middleware
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))

// Handlebars
// Serve static content for the app from the "public" directory.

// this is why main is loaded 
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

// Starting the server
// Syncing our sequelize models and then starting our Express app
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    )
  })
})

module.exports = app
