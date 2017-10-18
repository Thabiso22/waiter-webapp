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
    WaiterShift.findOne({
        name: waiterName
    }, function(err, waiter) {
        if (err) {
            console.log(err);
        } else if (waiter) {
            console.log(waiter.days);
            res.render("form", {
                name: waiterName,
                days: waiter.days
            });
        } else {
            var waiterShift = new WaiterShift({
                name: waiterName,
            });
            //console.log(newData);
            waiterShift.save(function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("form", {
                        name: waiterName
                    });
                    //res.render("form2",{name:results})
                }

            });
        }
    })
});

////Send the days a waiter can work to the server.
app.post("/waiters/:username", function(req, res) {
            var waiterName = req.params.username;
            var workdays = req.body.workdays;
            workdaysObj = {};
            workdays.forEach(function(currentDay) {
                workdaysObj[currentDay] = true;
            })
            console.log(workdays);
            console.log(workdaysObj);
            WaiterShift.findOneAndUpdate({
                name: waiterName
            }, {
                $set: {
                    days: workdaysObj
                }
            }, {
                new: true
            }, function(err, updatedWaiter) {
                if (err) console.log(err);
                else {
                    console.log(updatedWaiter);
                    res.redirect("/waiters/"+waiterName);
                }
              });
            });

            ////Show your sister which days waiters can work
            app.get("/days", function(req, res) {
                        WaiterShift.find({}, function(err, results) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(results);
                                var monday = [];
                                var tuesday = [];
                                var wednesday = [];
                                var thursday = [];
                                var friday = [];

                                results.forEach(function(day) {
                                    // console.log("each :\n");
                                    // console.log(day);
                                    var Name = day.name;
                                    var Days = day.days;
                                    if (Days) {
                                      // Dayz = Object.keys(Days)
                                        for (i in Days) {
                                            if (i == "Monday") {
                                                monday.push(Name);
                                                // console.log("ndinguMonday" + monday);
                                            } else if (i == "Tuesday") {
                                                // console.log("ndinguTuesday" + tuesday);
                                                tuesday.push(Name);

                                            } else if (i == "Wednesday") {
                                                wednesday.push(Name);
                                                // console.log(wednesday);
                                            } else if (i == "Thursday") {
                                                thursday.push(Name);
                                                // console.log(thursday);
                                            } else if (i == "Friday") {
                                                friday.push(Name);
                                                // console.log(friday);
                                            }

                                        }
                                    }
                                });
                                console.log(monday);
                                console.log(tuesday);
                                console.log(wednesday);
                                console.log(thursday);
                                console.log(friday);
                                function changeCol(colour) {
                                    if (colour === 3) {
                                        return "greenColor";
                                    };
                                    if (colour < 3) {
                                        return "yellowColor";
                                    }
                                    if (colour > 3) {
                                        return "redColor";
                                    }
                                }
                                res.render("form2", {
                                    mondayDisp: monday,
                                    monColor: changeCol(monday.length),
                                    tuesdayDisp: tuesday,
                                    tueColor: changeCol(tuesday.length),
                                    wednesdayDisp: wednesday,
                                    wedColor: changeCol(wednesday.length),
                                    thursdayDisp: thursday,
                                    thursColor: changeCol(thursday.length),
                                    fridayDisp: friday,
                                    friColor: changeCol(friday.length)
                                })
                            }
                        });
                        });

                        app.post("/days", function(req, res) {
                            WaiterShift.remove({}, function(err, results) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    return results;
                                }
                            });

                        });

                        app.set("port", (process.env.PORT || 4000));
                        app.set("host", (process.env.HOST || "http://localhost"));
                        app.listen(app.get("port"), function(err) {
                            console.log('node app is running on port ' + app.get("host") + ":" + app.get('port'));
                        });
