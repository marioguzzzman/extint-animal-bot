// -------------------------------------------------------
// BOT AND MACHINE LEARNING PROJECT FROM THE SCHOOL OF MACHINES AND MAKE BELIEVE, BERLIN, JULY 2019 
// -------------------------------------------------------


// INSTRUCTIONS
//1. install nodejs 
//2. install npm 
//3. npminstall fs

// Don't remember why I wrote this: change the status var params = { status: 'testM', media_ids: [mediaIdStr] }

// TO RUN 
// 1. Go to folder on terminal
// 2. node bots.js
// 3. check out https://twitter.com/raidroth


//---- Requirements for Twitter 
var config = require('./config.js'); // Pulling all my twitter account info from another file
var request = require("request");

// Making a Twit object for connection to the API
var Twit = require('twit');
var T = new Twit(config);

//---- Requirements for files 
var fs = require('fs'); // For reading image files

//---- Requirements for text 
var tracery = require('tracery-grammar');

//---- Requirements for bot 
var animals = require('./animals.json') //Pull in the animal data

//-----Image scraper
// use Google image-scraper
var Scraper = require ('images-scraper')
var bing = new Scraper.Bing();


//---------TO OPERATE THE BOT-----------

//Look for animal
var animal = getAnimal();

//get the image
//var image = getImage();
//getImage();
//function is at the end of getImage section //alsino may have more insight into how this works

//create a text
var text = doText(animal); 

//post text and image in twitter
//tweeter(text, image);


// -------------
// GET ANIMAL 
// -------------


function getAnimal(){

   // This is a random number bot
  //var tweet = 'Here\'s a random number between 0 and 100: ' + Math.floor(Math.random()*100);

  var randomAnimal = animals[Math.floor(Math.random()*animals.length-1)];
  var randomAnimalName = randomAnimal["common_name"];
  var randomAnimalContinent = randomAnimal["continent"];
  var animal = randomAnimal;

  //console.log(animal);

  return animal;
}

console.log('Got a: ' + animal["common_name"]);


// -------------
// IMAGE SCRAPER 
// -------------

// Install the following packages via npm:
// 1. npm install request
// 2. npm install images-scraper

// // use Google image-scraper
// var Scraper = require ('images-scraper')
// var bing = new Scraper.Bing();


let searchTerm = animal["common_name"];
let fileName;


const getImage = async () => {

  bing.list({
    keyword: searchTerm,
    num: 1,
    detail: true
  })
  .then(function (data) {
    
    let imgSrc = data[0].url;
    console.log(imgSrc);
  
    downloadImage(imgSrc, searchTerm, function(){
    console.log('Image downloaded');
    //tweeter(fileName); // Send to tweeter I guess
  });
  
  }).catch(function(err) {
    console.log('err',err);
  })
  
  
  var downloadImage = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      let imgType = res.headers['content-type'].split("/")[1];
      fileName = filename + "." + imgType;
      request(uri).pipe(fs.createWriteStream(fileName)).on('close', callback);

      return fileName;      
    });
  };

}

getImage();


// ---------------
// TEXT GENERATOR 
// ---------------

//1. npm install tracery-grammar --save

// var tracery = require('tracery-grammar');
// var text = doText(); //create different texts to tweet

function doText(animal){

  //To look for animal depending on getAnimal function
  var animalName = animal["common_name"];
  var animalContinent = animal["continent"];

  var grammar = tracery.createGrammar({

    //get the values to asing in the text 
    'animal': [animalName],
    'continent': [animalContinent],

    // We can change all this text, it's just an example
    'scenario': ['#happened#'],

    'happened': [
      '#animal# is no longer with us', 
      '#animal# is just dead',
      'R.I.P #animal#',
      'Goodbye #animal#', 
      '#animal# was just a party animal, now it\'s gone', 
      '#person# crying about our friend #animal#', 
      'I am #animal#, and I lived in #continent#', 
      'I lived in #continent#, now all my friends are dead', 
      'Don\'t ya forget about me', 
      'I was your friendly neighbor #animal#', 
      'Here #animal#, long departed, but still remembered', 
      'What happened to my friends #animal#s after I went out of stock','What happened to my friends #animal#s after I went out of existance', 
      'thanks, I don\'t have to work anymore', 
      'It was not suicide', 
      'It was not euthanasia', 
      'I was #animal#, will you ever dream of me?', 
      'I am #animal#, I am coming for ya'],

    'person': ['I am', 'You should be'],

    'origin':['#scenario#'],
  });
    
  grammar.addModifiers(tracery.baseEngModifiers); 
  
  //console.log(grammar.flatten('#origin#'));

  console.log('Text created: ' +  grammar.flatten('#origin#'));


  var text = grammar.flatten('#origin#');

  return text;
}

//---------TWEETER BOT CODE-----------

// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// Using the Twit node package
// https://github.com/ttezel/twit

// npm install twit



//  tweet 'hello world!'  
T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
})

// // Start once
//tweeter(text);

// Once every N milliseconds // how much will the bot tweet
//setInterval(tweeter, 60*5*1000);

// Here is the bot!
function tweeter(image, text) {

//To import the images we have two options:

//1. Read the file made by Processing
// var b64content = fs.readFileSync('images/dog.jpeg', { encoding: 'base64' })

//2. Read image variable from the SCRAPER
var b64content = fs.readFileSync(image, { encoding: 'base64' })

// // This is a random number bot
// var tweet = 'Here\'s a random number between 0 and 100: ' + Math.floor(Math.random()*100);

// //Look for the animal
// var randomAnimal = animals[Math.floor(Math.random()*animals.length-1)];
// var randomAnimalName = randomAnimal["common_name"];

// var tweet = 'i am crying about my friend ' + randomAnimalName;
// var tweet = text; //tweet or previous generated text

  //animals[1]["Name"]
  //console.log(randomAnimalName);

//   // Post that tweet!
//  T.post('statuses/update', { status: tweet }, tweeted);

  // Upload the media
  T.post('media/upload', { media_data: b64content }, uploaded);
  function uploaded(err, data, response) {

    // Now we can reference the media and post a tweet
    // with the media attached
    var mediaIdStr = data.media_id_string;
    var params = { status: searchTerm, media_ids: [mediaIdStr] }
    // Post tweet
    T.post('statuses/update', params, tweeted);
  };

  // Callback for when the tweet is sent
  function tweeted(err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Success: ' + data.text);
      //console.log(response);
    }
  };

}
































