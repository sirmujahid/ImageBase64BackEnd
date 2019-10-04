const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({});
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Images', { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open',() => console.log("Connected to Mongodb"));



const imageSchema = mongoose.Schema({
  // _id: { type: Schema.ObjectId, auto: true },
  name : { type: String , required: true , unique: true},
  imagebase64 : { type : String , required: true}
});

const image = mongoose.model('image', imageSchema, 'imagesInbase64');

/* GET home page. */

router.get('/',(req, res, next) => {
  res.send("<h2>Access Denied</h2>")
});

router.get('/getAllImages',(req, res, next) => {
  image.find({})
    .then( data => {
      res.send(data);
    })
});

router.get('/getImageById',(req, res, next) => {
  imageSchema.findbyId(req.body.id, (err,data) => {
    if(err){
      res.send('error');
    } else {
      res.send(data);
    }
  });


});

router.post('/uploadingImage', upload.single('image') ,(req, res, next) => {
  const encoded = req.file.buffer.toString('base64');
  const name = req.body.name;
  console.log("uploading");

  let newEntry = new image();
  newEntry.name = name;
  newEntry.imagebase64 = encoded;

  newEntry.save((err) => {
    if(err) console.log(err);
    else {
      res.send("Success")
    }
  });
});

module.exports = router;
