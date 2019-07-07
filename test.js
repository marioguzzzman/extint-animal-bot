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
    // tweeter(fileName);
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

// Here is the bot!
function tweeter(image) {

  // Read the file made by Processing
  var b64content = fs.readFileSync(image, { encoding: 'base64' })


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