const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check_auth')
const multer = require('multer')
const data = require("../data");
const bookData = data.book;
const storage = multer.diskStorage({
      destination: function(req, file, cb){
          cb(null,'./uploads/')
      },
      filename: function(req, file, cb){
          cb(null,new Date().toISOString() + file.originalname)
      }
  })
const fileFilter = (req, file, cb)=>{
      if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            cb(null, true)
      }else{
            cb(null, false)
      }
}
const upload = multer({
      storage:storage, 
      limits:{
          fileSize: 1024*1024*5
      },
      fileFilter: fileFilter
  })

//Create books
router.post('/', upload.single('bookImage'),async (req, res) => { //check_Auth after --> use array('bookImage',10) to upload multiple images 
try{
      
        if(typeof req.body.bookName !== 'undefined' && typeof req.body.bookAuthor !== 'undefined' && typeof req.body.bookPublisher !== 'undefined' && typeof req.body.bookDescription !== 'undefined' && typeof req.body.bookGenre !== 'undefined' && typeof req.body.bookPrice !== 'undefined' && req.body.bookISBN !== 'undefined' && req.file.path !== 'undefined' && req.body.bookType !== 'undefined' && req.body.bookLanguage !== 'undefined' && req.body.bookPublishTime !== 'undefined' && req.body.bookSeries !== 'undefined'){
           
          const book = await bookData.create(req.body.bookName, req.body.bookAuthor, req.body.bookPublisher, req.body.bookDescription, req.body.bookGenre, req.body.bookPrice, req.body.bookISBN, req.file.path, req.body.bookType, req.body.bookLanguage, req.body.bookPublishTime, req.body.bookSeries)
      
         
          res.status(200).json({
             message:"Create book successfully",
             book: book
            })
        }else{
          throw 'Please fill all fields'
        }
    }catch(e){
      //   res.status(400).render("Component/signup",{
      //       error : e,
      //   })
        res.status(400).json({
          error:e
        })
    }
    
     
});

//get book by keywork from search box
router.get("/search", async (req, res) => { //check_Auth
    try{
        console.log('1')
        // var series = req.body.bookSeries.toUpperCase();
        // const book = await bookData.get("HARRY POTTER");
        res.status(200).json({
            message:"Search all book successfully",
            book: book
           })
    }catch(e){
        res.status(400).json({
            error:e
          })
    }
    
     
});


//get book by id
router.get("/:id", async (req, res) => { //check_Auth
    try{
        console.log('1')
        const id = req.params.id;
        const book = await bookData.get(id)
        console.log(id)
        res.status(200).json({
            message:"Search all book successfully",
            book: book
           })
    }catch(e){
        res.status(400).json({
            error:e
          })
    }
    
     
});

module.exports = router;