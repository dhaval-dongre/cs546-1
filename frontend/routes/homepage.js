const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check_auth')
const data = require("../data");
const userData = data.user;
const bookData = data.book;//Search book and display books in the homepage after window loading

router.get("/",checkAuth, async (req, res) => { //check_Auth
    try{
      var total = 0;
      const id = req.cookies.userid;
      console.log(id)
      const userInfo = await userData.get(id)
      console.log('id')
      const book = await bookData.getSeries("HARRY POTTER");
      const books = await bookData.getSeries("NIGHTSIDE");
      console.log(books[0]._id)
      console.log('id')
      const book1 = await bookData.getFourSeries("NIGHTSIDE");//5cbff057dd71db21769db1f6
      console.log('id')
      const book2 = await bookData.get(books[0]._id);
      console.log('id')
      console.log(userInfo)

      for(var i = 0; i < userInfo.cart.length; i++){
        total = total + userInfo.cart[i].qty
      }

      res.status(200).render("Component/homepage", {
        title:"Home Page",
        cartTotal: total,
        userid:userInfo._id,
        firstName: userInfo.firstName,
        bookType: book[0].bookType,
        bookSeries: book[0].bookSeries,
        book:book,
        book1: book1,
        book2: book2
      });
    }catch(e){
      res.status(400).json({
        error: e
      });
    }
     
});



module.exports = router;