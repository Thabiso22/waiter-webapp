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
    var workdays = req.body.workdays;
    res.render("form", {
        name: waiterName,
        days: workdays
    });
});

////Send the days a waiter can work to the server.
app.post("/waiters/:username", function(req, res) {
    var waiterName = req.params.username;
    var workdays = req.body.workdays;

    //console.log(workdays);
    var waiterShift = new WaiterShift({
        name: waiterName,
        days: workdays
    });
    //console.log(newData);
    waiterShift.save(function(err, results) {
        if (err) {
            console.log(err);
        } else {
            //res.render("form2",{name:results})
        }

    });

});

////Show your sister which days waiters can work
app.get("/days", function(req, res) {
    WaiterShift.find({}, function(err, results) {
      if (err) {
        console.log(err);
      }else {
        var monday = [];
        var tuesday = [];
        var wednesday = [];
        var thursday = [];
        var friday = [];
results.forEach(function (day) {
  var Name = day.name;
  var Days = day.days;
  for (var i = 0; i < Days.length; i++) {

    if (Days[i] == "Monday") {
      monday.push(Name);
      // console.log("ndinguMonday" + monday);
    }else if (Days[i] == "Tuesday") {
      // console.log("ndinguTuesday" + tuesday);
      tuesday.push(Name);

    }else if (Days[i] == "Wednesday") {
      wednesday.push(Name);
      // console.log(wednesday);
    }else if (Days[i] == "Thursday") {
      thursday.push(Name);
      // console.log(thursday);
    }else if (Days[i] == "Friday") {
      friday.push(Name);
      // console.log(friday);
    }


  }
});

function changeCol(colour)
{
  if(colour === 3){return "greenColor";};
  if (colour < 3) {
    return "yellowColor";
  }if (colour > 3){
    return "redColor";
  }
}
res.render("form2",{
  mondayDisp:monday,
  monColor:changeCol(monday.length),
  tuesdayDisp:tuesday,
  tueColor:changeCol(tuesday.length),
  wednesdayDisp:wednesday,
  wedColor:changeCol(wednesday.length),
  thursdayDisp:thursday,
  thursColor:changeCol(thursday.length),
  fridayDisp:friday,
  friColor:changeCol(friday.length)
})




      }



    })
});
app.set("port", (process.env.PORT || 4000));
app.set("host", (process.env.HOST || "http://localhost"));
app.listen(app.get("port"), function(err) {
    console.log('node app is running on port ' + app.get("host") + ":" + app.get('port'));
});
