const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const cartData = data.cart
const bookData = data.book;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const checkAuth = require('../middleware/check_auth')
const checkCookie = require('../middleware/check_cookie')

router.get("/signup", checkCookie, async (req, res) => {
  console.log("sign up")
  res.status(200).render("Component/signup", {
    title:"Signup Page"
  });
});
router.get("/dashboard", async (req, res) => {
  console.log("dashboard")
  res.status(200).render("Component/dashboard", {
    title:"Dashboard Page"
  });
});
router.post("/cart/add/:userid", async (req, res) => {
  console.log("cart");
  try{
    var total = 0;
    console.log("inCart");
    const bookId = req.query.bookId;
    // const userId = req.cookies.userid;
    const userId = req.params.userid;
    const quantity = req.body.quantity;
    const addInfo = await cartData.addItem(userId, bookId, quantity);
    for(var i = 0; i < addInfo.cart.length; i++){
      total = total + addInfo.cart[i].qty
    }
    
    res.status(200).json({
      info:addInfo,
      total: total
    })
  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});


router.get("/cart/:userid", async (req, res) => {
  console.log("cart");
  try{
    var arr = [];
    var arr1=[]
    
    var bookInfo;
    var bookTotal=0;
    var eachtotal;
    const id = req.params.userid;
    console.log("inCart");
    var total = 0;
    console.log(id)
    const userInfo = await userData.get(id)
    console.log('id')
    console.log(userInfo)
    
    for(var i = 0; i < userInfo.cart.length; i++){
      eachtotal = 0;
      total = total + userInfo.cart[i].qty;
      bookInfo = await bookData.get(userInfo.cart[i].id);
      
      eachtotal = parseFloat(bookInfo.bookPrice)*userInfo.cart[i].qty
      bookTotal = bookTotal + eachtotal
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['eachTotal'] = eachtotal.toFixed(2);
      arr.push(bookInfo)
    }

    for(var j = 0; j < userInfo.paymentMethod.length; j++){
    var obj1 = {};
     obj1['number']=userInfo.paymentMethod[j].cardNumber.substring(15,19);
     obj1['cardnumber']=userInfo.paymentMethod[j].cardNumber
     arr1.push(obj1)
    }
    console.log('arr1')
    console.log(arr1)
  
   
    res.status(200).render("Component/cart",{
      title:"Cart",
      userid:id,
      cartTotal: total,
      firstName: userInfo.firstName,
      books:arr,
      bookTotal: bookTotal.toFixed(2),
      addresses:userInfo.address,
      payments: arr1
    })
  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});

router.post("/cart/delete/:bookId", async (req, res) => {///delete
  console.log("cart");
  try{
    var arr = [];
    var bookInfo;
    var total = 0;
    var bookTotal;
    console.log("inCart");
    const bookId = req.params.bookId;
    console.log(bookId)

    const userId = req.cookies.userid;;
    console.log(userId)

    const deleteInfo = await cartData.delete(userId, bookId);
    const userInfo = await userData.get(userId)
    console.log('test')
    for(var i = 0; i < userInfo.cart.length; i++){
      bookTotal = 0;
      total = total + userInfo.cart[i].qty
      bookInfo = await bookData.get(userInfo.cart[i].id);
      bookTotal = bookTotal + bookInfo.bookPrice
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['bookTotal'] = bookTotal;
      arr.push(bookInfo)
    }

    console.log(arr)
    console.log('test1')
 

    res.status(200).redirect("/user/cart/"+userId)

  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});

///Update quantity
router.post("/cart/update/:bookId", async (req, res) => {
  console.log("Updatecart");
  try{
    var arr = [];
    var bookInfo;
    var total = 0;
    var bookTotal;
    console.log("inCart");
    const bookId = req.params.bookId;
    console.log(bookId)
    const quantityString = req.body.quantity;
    // console.log(req.body);
    // console.log(typeof quantity);
    const quantity = parseInt(quantityString);
    const userId = req.cookies.userid;
    console.log(userId)

    const deleteInfo = await cartData.updateItem(userId, bookId, quantity);
    const userInfo = await userData.get(userId)
    console.log('test')
    for(var i = 0; i < userInfo.cart.length; i++){
      bookTotal = 0;
      total = total + userInfo.cart[i].qty
      bookInfo = await bookData.get(userInfo.cart[i].id);
      bookTotal = bookTotal + bookInfo.bookPrice
      bookInfo['bookQuantity'] = userInfo.cart[i].qty
      bookInfo['bookTotal'] = bookTotal;
      arr.push(bookInfo)
    }

    console.log(arr)
    console.log('test1')
 

    res.status(200).redirect("/user/cart/"+userId)
    // res.status(200).json({
    //   user:userInfo
    // })
  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});

router.post("/signup", async (req, res) => {
  try{
    console.log(req.body)
      if(typeof req.body.firstname !== 'undefined' && typeof req.body.lastname !== 'undefined' && typeof req.body.phonenumber !== 'undefined' && typeof req.body.email !== 'undefined' && typeof req.body.pwd !== 'undefined'){
        console.log(req.body)
        const user = await userData.create(req.body.firstname, req.body.lastname, req.body.phonenumber, req.body.email, req.body.pwd)
        const token = jwt.sign({/////////put tolen in the data
          email: user.email ,
          userId: user._id
        },
        process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        )
        console.log(user._id);
        res.cookie('token', token);
        res.cookie('userid', user._id);
     
        res.status(200).redirect("/homepage")     
        // res.status(200).render("Component/homepage", {
        //   title:"Home Page",
        //   user: user
        // })    
      }else{
        throw 'Please fill all fields'
      }
  }catch(e){
      res.status(400).render("Component/signup",{
          error : e,
      })
      // res.status(400).json({
      //   error:e
      // })
  }
});

router.get("/login", checkCookie,async (req, res) => {
  console.log("log in")
  res.status(200).render("Component/login", {
    title:"Log In Page"
  });
});

router.post("/login", async (req, res) => {
  try{
    console.log(req.body)
      if(typeof req.body.email !== 'undefined' && typeof req.body.pwd !== 'undefined'){
        
        const user = await userData.login(req.body.email, req.body.pwd)
        console.log('step 4')
        console.log(user);
        console.log(user['user'][0]._id);
        
        res.cookie('token', user['token']);
        res.cookie('userid', user['user'][0]._id);
        res.status(200).redirect("/homepage")     
        // res.status(200).render("Component/homepage", {
        //   title:"Home Page",
        //   user: user['user'][0]
        // })    
        // res.status(200).json({
        //   message: "Handling POST requests to /login",
        //   User : user['user'][0],
        //   token: user['token']
        // });
      }else{
        throw 'Please fill all fields'
      }
  }catch(e){
      res.status(400).render("Component/signup",{
          error : e,
      })
      // res.status(400).json({
      //   error:e
      // })
  }
});

//////Update address
router.post("/update/address", async (req, res) => {
  console.log("cart");
  try{
  
    console.log("inAddress");
    console.log(req.body);
    const userId = req.cookies.userid;
    // const userId = req.params.userid;
    console.log(userId)

    const uodateInfo = await userData.createAddress(userId, req.body.address, req.body.city, req.body.state, req.body.zip, req.body.country) ;
    const userInfo = await userData.get(userId)
    console.log('test')
   
    res.status(200).redirect("/user/cart/"+userId)
    // res.status(400).json({
    //   user:userInfo
    // })
  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});

router.post("/update/payment/", async (req, res) => {
  console.log("payment");
  try{
    console.log(req.body)
    const userId = req.cookies.userid;
    // const userId = req.params.userid;
    console.log(userId)
    const month =  req.body.expiration.substring(0,2)
    const year = req.body.expiration.substring(3,5)
    const uodateInfo = await userData.createPayment(userId, req.body.cardnumber, req.body.name, year, month) ;
    const userInfo = await userData.get(userId)
    console.log('test')
   
    res.status(200).redirect("/user/cart/"+userId)
    // res.status(200).json({
    //   user:userInfo
    // })
  }catch(e){
    res.status(400).json({
      error:e
    })
  }
});

module.exports = router;
