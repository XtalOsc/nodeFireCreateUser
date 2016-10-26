var firebase = require('firebase');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// Static files
app.use(express.static('public'));

firebase.initializeApp({
  serviceAccount: "./server/firebase-service-account.json",
  databaseURL:"https://firenode-155ef.firebaseio.com/",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// This is the route for your secretData
app.get("/privateData", function(req, res){

  /* This is where the magic happens. We pull the idtoken off of the request,
  verify it against our private_key, and then we return the decodedToken */
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    /* Whatever you do in here is protected by your authorization.
    WARNING: So far you are returning secret data to ANYONE who is logged in
    there is still more work to be done if you want to implement roles
    You can use the decodedToken and some logic to do that. */

    console.log(decodedToken); // Here you can see the information firebase gives you about the user
    res.send("Secret DATA!!! You got it!!! Great work " + decodedToken.email + "!!!");
  })
  .catch(function(error) {
    // If the id_token isn't right, you end up in this callback function
    res.send("No secret data for you!");
  });

});

app.post("/createNewUser", function(req, res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log(decodedToken);
    if(decodedToken.email == "test@test.com"){
      console.log("This person should get data, the body looks like: ", req.body);
      res.send("Congrats " + decodedToken.email + "! You added a new user " + req.body.email + "to the database!!!");
    } else {
      res.send("No secret data for you!");
    }

  })
  .catch(function(error) {
    console.log(error);
    res.send("It's an error man!");
  });

});

var portDecision = process.env.PORT || 5001;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
