/*!
  nodejs-s3-exif-to-mongodb
  by Kodie Grantham [www.kodieg.com]
  https://github.com/kodie/nodejs-s3-exif-to-mongodb
*/

// Import our required modules
var argv = require('yargs').argv;
var async = require('async');
var mongodb = require('mongodb').MongoClient;
var parseEXIF = require('exif').ExifImage;
var parseXML = require('xml2js').parseString;
var request = require('request');

// Set up our global arrays/objects
var settings = {};
var images = {};
var imageData = [];

// Check for required arguments
var requiredVars = ['xmlURL', 'mongoURL', 'mongoCol'];
for (i = 0; i < requiredVars.length; i++) {
  if (argv[requiredVars[i]]) {
    // Set setting via command line option
    settings[requiredVars[i]] = argv[requiredVars[i]]
  } else if (process.env[requiredVars[i]]) {
    // Set setting via exported variable
    settings[requiredVars[i]] = process.env[requiredVars[i]];
  } else {
    // Missing required argument
    console.log('Missing ' + requiredVars[i] + ' argument.');
    process.exit(1);
  }
}

function getImagesFromXML() {
  // Fetch the XML data
  console.log('Fetching XML...');
  request.get(settings.xmlURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // Parse the XML data
      console.log('Parsing XML...');
      parseXML(body, function(error, result) {
        if (!error) {
          // Store the parsed XML data into the images object
          images = result.ListBucketResult.Contents;

          // Make sure that we actually have the images
          if (images.length) {
            console.log('Images found:', images.length);

            // Start the next step
            getEXIFdata();
          } else {
            console.log('No images found.');
            process.exit(1);
          }
        } else {
          console.log('Error parsing XML data:', error.message);
          process.exit(1);
        }
      });
    } else {
      console.log('Error fetching XML data:', error.message);
      process.exit(1);
    }
  });
}

function getEXIFdata() {
  console.log('Fetching EXIF data...');

  // Loop through the images
  async.reduce(images, "", function(memo, item, callback) {
    var fileName = item.Key[0];
    var fileURL = settings.xmlURL + '/' + fileName;
    var fileETag = item.ETag[0];

    // Download the image
    request.get({url:fileURL, encoding:null}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Parsing EXIF data for', fileName);

        // Parse the EXIF data
        try {
          new parseEXIF(body, function(error, exifData) {
            if (!error) {
              // Put the EXIF data into our imageData array
              imageData.push({
                name: fileName,
                url: fileURL,
                etag: fileETag,
                data: exifData
              });

              // Finish
              callback();
            } else {
              // Failed to parse EXIF data
              console.log('Error parsing EXIF data for', fileName);
              console.log(error.message);

              // Finish
              callback();
            }
          });
        } catch(error) {
          // Failed to parse EXIF data
          console.log('Error parsing EXIF data for', fileName);
          console.log(error.message);

          // Finish
          callback();
        }
      } else {
        // Failed to download image
        if (!error) {
          // Generate our own error message based on the statusCode/statusMessage
          error = {};
          error.message = 'Status code ' + response.statusCode + ' (' + response.statusMessage + ')';
        }

        console.log('Error fetching image', fileName);
        console.log(error.message);

        // Finish
        callback();
      }
    });
  }, function(){
    // Finished getting EXIF data for all images
    console.log('Finished getting EXIF data.');
    console.log(imageData.length + ' images successfully proccessed.');
    console.log((images.length - imageData.length) + ' images could not be processed.');

    // Run the next function
    storeImageData();
  });
}

function storeImageData() {
  // Connect to the MongoDB server
  console.log('Connecting to database...');
  mongodb.connect(settings.mongoURL, function(error, db) {
    if (!error) {
      // Set the collection
      var col = db.collection(settings.mongoCol);

      // Insert the data
      col.insert(imageData, function(error, result){
        if (!error) {
          // Insert successful
          console.log('Successfully inserted ' + result.result.n + ' images into the database!');
          process.exit();
        } else {
          // Insert failed
          console.log('Could not insert image data into database:', error);
          process.exit(1);
        }
      });
    } else {
      // Connection failed
      console.log('Unable to connect to database:', error);
      process.exit(1);
    }
  });
}

// Start the whole process
getImagesFromXML();
