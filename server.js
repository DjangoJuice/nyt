// External Dependencies
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

// Express Server
const app = express();
const PORT = process.env.PORT || 3001;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// routes
app.use(routes);

// Connnection Mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist");

// Server start
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

app.get("/", function(req, res) {
    res.render("index");
})

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(res) {
    var $ = cheerio.load(res.data);
    //console.log("res.data", res.data.children("a").children("h3").text())

    
    // Store $crape results
    var result = [];
    $("h3.title-link__title").each(function(i, element) {

      var title = $(element).children().text();
      var link = $(element).parent("a").attr("href");
  
      // Save these results in an object that we'll push into the results array we defined earlier
      result.push({
        title: title,
        link: link
      });
    });
    //console.log(result)
    //return result;
    // Add the text and href of every link, and save them as properties of the result object
    //.children("a").children("h3").text()
    // result.title = $(this).children().text();
    // result.link = $(this).children("a").attr("href");

     console.log("testing results", result)
    return result
     // $crape results go into the DB for displaying to the DOM later
 }).then(function(dbArticle) {
  console.log('DOES THIS GET RAN!???????????????????')
  console.log('db article!!!!!! ', dbArticle)
 // console.log("Trying`````````````", dbArticle);
Article.create(dbArticle)
res.send("Complete")
  // View the added result in the console
})
.catch(function(err) {
  // If an error occurred, send it to the client
  return res.json(err);
});
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });