var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($scope, $firebaseArray, $firebaseAuth, $http) {
  var auth = $firebaseAuth();




  // This code runs whenever the user logs in
  $scope.logIn = function(){
    auth.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
      console.log("Authentication Success!");
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/privateData',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          $scope.secretData = response.data;
        });
      });
    }else{
      console.log('Not logged in.');
      $scope.secretData = "Log in to get some secret data."
    }

  });

  // This code runs when the user logs out
  $scope.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  };


  $scope.createNewUser = function(){
    if(firebase.auth().currentUser) {



      secondaryApp.auth().createUserWithEmailAndPassword($scope.newEmail, $scope.newPassword).then(function(firebaseUser) {
        console.log("User " + firebaseUser.email + " created successfully!");
        //I don't know if the next statement is necessary
        secondaryApp.auth().signOut();
        firebase.auth().currentUser.getToken()
        .then(function(idToken){
          $http({
            method: 'POST',
            url: '/createNewUser',
            headers: {
              id_token: idToken
            },
            data: {
              email: $scope.newEmail
            }
          })
          .then(function(response){
            $scope.createNewUserResponse = response.data;
            console.log(response);
          });
        });
      });
  } else {
    console.log('Log in to create a new user');
  }

};//end createNewUser

});//end SampleCtrl
