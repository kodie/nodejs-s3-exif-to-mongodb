# nodejs-s3-exif-to-mongodb

A small [Node.js](https://nodejs.org/) app that takes the XML response from an [Amazon S3](https://aws.amazon.com/s3/) bucket that is filled with images and stores the EXIF data from those images into a [MongoDB](https://www.mongodb.com/) collection.

### Installation
```
$ git clone https://github.com/kodie/nodejs-s3-exif-to-mongodb.git
$ cd nodejs-s3-exif-to-mongodb
$ npm install
```

### Required Variables
* xmlURL - The URL to the public bucket XML. (Private buckets possibly coming soon)
* mongoURL - The URL to the MongoDB database.
* mongoCol - The name of the MongoDB collection that you would like the data stored in.

These variables can be set either by exported variables or by passing them in an option via command line.

### Usage
*via exported variables:*
```
export xmlURL="http://s3.amazonaws.com/my-bucket";
export mongoURL="mongodb://localhost:3001/my-db";
export mongoCol="images";
$ node app.js
```

*via command line options:*
```
$ node app.js --xmlURL=http://s3.amazonaws.com/my-bucket --mongoURL=mongodb://localhost:3001/my-db --mongoCol=images
```

### Collection Structure
```
{
  name: "my-image1.jpg",
  url: "http://s3.amazonaws.com/my-bucket/my-image1.jpg",
  etag: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  size: 1182657,
  data: {
    image: {},
    thumbnail: {},
    exif: {},
    gps: {},
    interoperability: {},
    makernote: {}
  }
}
```

### Used Modules
* [async](https://github.com/caolan/async/)
* [mongodb](https://github.com/mongodb/node-mongodb-native/)
* [node-exif](https://github.com/gomfunkel/node-exif/)
* [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js/)
* [request](https://github.com/request/request/)
* [yargs](https://github.com/yargs/yargs/)
