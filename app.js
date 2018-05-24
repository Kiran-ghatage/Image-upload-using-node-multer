const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


//set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null,file.fieldname +'-'+ Date.now() + path.extname(file.originalname));
  }
});

//initialize uploads
const upload = multer({
  storage: storage,
  /// file size limit to 1mb
  limits:{fileSize: 1000000},
  fileFilter: function(rq, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed extentions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extentions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const app = express();

//EJS View Engin
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) =>{
upload(req, res, (err) =>{
  if(err){
    res.render('index', {
      msg: err
    });
  }else {
    console.log(req.file);  /////it will give alll the details about file in terminal
    if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
  }
});
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
