$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCWW3bqaMSnkMyehxnDjKT8cciFFnq4Npw",
    authDomain: "trainscheduletracker-dacbd.firebaseapp.com",
    databaseURL: "https://trainscheduletracker-dacbd.firebaseio.com",
    projectId: "trainscheduletracker-dacbd",
    storageBucket: "trainscheduletracker-dacbd.appspot.com",
    messagingSenderId: "27051616665"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = 0;

  $("#btn-submit").on("click", function() {
    trainName = $("#train-name")
      .val()
      .trim();
    destination = $("#train-destination")
      .val()
      .trim();
    firstTrain = $("#first-train")
      .val()
      .trim();
    frequency = $("#frequency")
      .val()
      .trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });
  });

  database.ref().on("child_added", function(response) {
    var res = response.val();

    var trainFirstTime = res.firstTrain.split(":");
    var trainHour = trainFirstTime[0];
    var trainMinutes = trainHour * 60 + parseInt(trainFirstTime[1]);
    var moments = moment().format("HH:mm");

    var currentTime = moments.split(":");
    var currentHours = currentTime[0];
    var currentTotalMinutes = currentHours * 60 + parseInt(currentTime[1]);

    for (var i = 0; trainMinutes < currentTotalMinutes; i++) {
      trainMinutes += parseInt(res.frequency);
    }

    var minutesAway = trainMinutes - currentTotalMinutes;

    var nextArivalHour = Math.floor(trainMinutes / 60);
    var nextArivalMinutes = trainMinutes % 60;

    var nextArival = nextArivalHour + ":" + nextArivalMinutes;
    var nextArivalFormat = moment(nextArival, "HH:mm").format("hh:mm A");

    console.log(trainMinutes);
    console.log(currentTotalMinutes);
    var tr = $("<tr>");

    var tdTrainName = $("<td>");
    tdTrainName.text(res.trainName);

    var tdDestination = $("<td>");
    tdDestination.text(res.destination);

    var tdFrequency = $("<td>");
    tdFrequency.text(res.frequency);

    var tdNextArrival = $("<td>");
    tdNextArrival.text(nextArivalFormat);

    var tdMinutesAway = $("<td>");
    tdMinutesAway.text(minutesAway);

    tr.append(
      tdTrainName,
      tdDestination,
      tdFrequency,
      tdNextArrival,
      tdMinutesAway
    );
    $("#train-details").append(tr);
  });
});
