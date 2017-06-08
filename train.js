// Initialize Firebase
var config = {
    apiKey: "AIzaSyC5y6Yl_4n5BOBXNI6h22HZhUbnGYbrpWE",
    authDomain: "thomas-b6e3f.firebaseapp.com",
    databaseURL: "https://thomas-b6e3f.firebaseio.com",
    projectId: "thomas-b6e3f",
    storageBucket: "thomas-b6e3f.appspot.com",
    messagingSenderId: "526805251686"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Train
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var location = $("#location-input").val().trim();
    var firstTrainTime = $("#time-input").val().trim();
    // console.log('Test: ' + firstTrainTime);
    var frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: location,
        first: firstTrainTime,
        freq: frequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.freq);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#location-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var location = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;

    // Train info
    console.log(trainName);
    console.log(location);
    console.log(firstTrainTime);
    console.log(frequency);

    var frequencyInt = parseInt(frequency);

    // Calculating train's next arrival
    var convertedFirstArrival = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log('converted ' + convertedFirstArrival);
    var currentTime = moment();
    var diffTime = moment().diff(moment(convertedFirstArrival), "minutes");
    console.log('diffTime ' + diffTime);


    var tRemainder = diffTime % frequencyInt;
    console.log('tRemainder: ' + tRemainder);

    var tMinutesTillTrain = frequencyInt - tRemainder;
    console.log('tMinutesTillTrain: ' + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextArrival = moment(nextTrain).format("HH:mm");


    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + location + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});