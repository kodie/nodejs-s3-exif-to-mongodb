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
    image: {
      Make: 'FUJIFILM',
      Model: 'FinePix40i',
      Orientation: 1,
      XResolution: 72,
      YResolution: 72,
      ResolutionUnit: 2,
      Software: 'Digital Camera FinePix40i Ver1.39',
      ModifyDate: '2000:08:04 18:22:57',
      YCbCrPositioning: 2,
      Copyright: '          ',
      ExifOffset: 250
    },
    thumbnail: {
      Compression: 6,
      Orientation: 1,
      XResolution: 72,
      YResolution: 72,
      ResolutionUnit: 2,
      ThumbnailOffset: 1074,
      ThumbnailLength: 8691,
      YCbCrPositioning: 2
    },
    exif: {
      FNumber: 2.8,
      ExposureProgram: 2,
      ISO: 200,
      ExifVersion: <binary>,
      DateTimeOriginal: '2000:08:04 18:22:57',
      CreateDate: '2000:08:04 18:22:57',
      ComponentsConfiguration: <binary>,
      CompressedBitsPerPixel: 1.5,
      ShutterSpeedValue: 5.5,
      ApertureValue: 3,
      BrightnessValue: 0.26,
      ExposureCompensation: 0,
      MaxApertureValue: 3,
      MeteringMode: 5,
      Flash: 1,
      FocalLength: 8.7,
      MakerNote: <binary>,
      FlashpixVersion: <binary>,
      ColorSpace: 1,
      ExifImageWidth: 2400,
      ExifImageHeight: 1800,
      InteropOffset: 926,
      FocalPlaneXResolution: 2381,
      FocalPlaneYResolution: 2381,
      FocalPlaneResolutionUnit: 3,
      SensingMethod: 2,
      FileSource: <binary>,
      SceneType: <binary>
    },
    gps: {
      GPSVersionID: [
        2,
        2,
        0,
        0
      ]
    },
    interoperability: {
      InteropIndex: 'R98',
      InteropVersion: <binary>
    },
    makernote: {
      Version: <binary>,
      Quality: 'NORMAL ',
      Sharpness: 3,
      WhiteBalance: 0,
      FujiFlashMode: 1,
      FlashExposureComp: 0,
      Macro: 0,
      FocusMode: 0,
      SlowSync: 0,
      AutoBracketing: 0,
      BlurWarning: 0,
      FocusWarning: 0,
      ExposureWarning: 0
    }
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
