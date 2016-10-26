var config = {
  apiKey: "AIzaSyDyqwXRaXbc3L-nXk2sWyhvgk78LBBfY9Y",
  authDomain: "testuser-ceac9.firebaseapp.com",
  databaseURL: "https://testuser-ceac9.firebaseio.com",
  storageBucket: "testuser-ceac9.appspot.com",
  messagingSenderId: "572186693149"
};
var mainApp = firebase.initializeApp(config);


var secondaryApp = firebase.initializeApp(config, "Secondary");
