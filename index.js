var express = require('express');
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var WaiterShift = require("./database3");
var app = express();


//body Parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

//expose express static folder
app.use(express.static('public'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: "handlebars"
}));
app.set('view engine', 'handlebars');

///Show waiters a screen where they can select the days they can work on
app.get("/waiters/:username", function(req, res) {
    var waiterName = req.params.username;
    res.render("form", {
        name: waiterName
    });


});

////Send the days a waiter can work to the server.
app.post("/waiters/:username", function(req, res) {
    var waiterName = req.params.username;
    var workdays = req.body.workdays;

    console.log(req.body);
    var waiterShift = new WaiterShift({
        name: waiterName[""] !== undefined,
        monday: workdays["Monday"] !== undefined,
        tuesday:workdays["Tuesday"] !== undefined ,
        wednesday: workdays["Wednesday"] !== undefined,
        thursday: workdays["Thursday"] !== undefined,
        friday: workdays["Friday"] !== undefined
    });
    //console.log(newData);
     waiterShift.save(function(err, results) {
         if (err) {
            console.log(err);
        } else {
          //console.log(results);
        }
});

});

////Show your sister which days waiters can work
app.get("/days", function(req, res) {
    // /////filter checkboxes ////////
    //
    // var checks = req.body.checkBox;
    // // console.log(radios);
    // database.find({
    //     name: {
    //         $regex: checks
    //     }
    // }, function(err, results) {
    //     console.log(results);
    //     res.render("form", {
    //         name: results
    //     });
    // });

});

app.set("port", (process.env.PORT || 4000));
app.set("host", (process.env.HOST || "http://localhost"));
app.listen(app.get("port"), function(err) {
    console.log('node app is running on port ' + app.get("host") + ":" + app.get('port'));
});
