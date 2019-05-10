const express = require("express");
const router = express.Router();

router.get("/",(req, res) => {
  res.status(200).render("Component/about", {
    title:"About Page"
  });
});



module.exports = router;
