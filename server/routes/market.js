const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersOnly, adminsOnly } = require('../middleware/verify_user')

//------------------------------------------------1-GET (all market products)---------

router.get("/", usersOnly, async (req, res) => {
    try {       
      // query 1
        const allProducts = await myQuery(`SELECT * FROM products_table
                                        LEFT JOIN categories_table
                                        ON products_table.category_id_ref = categories_table.category_id`);           

      res.send(allProducts);

    } catch (err) {
      res.status(500).send(err);
    }
});
//--------------------------------------------------2-GET (all_categories)--------------
router.get("/all_categories", usersOnly, async (req, res) => {
  try {       
    const all_categories = await myQuery(`SELECT * FROM categories_table`);
    //console.log(all_categories);           
    res.send(all_categories);

  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------------------------------------3-GET (products by category id)---------

router.get("/:category_id", usersOnly, async (req, res) => {
    try {
      // query 1
        const allProducts = await myQuery(`SELECT * FROM products_table
                                        LEFT JOIN categories_table
                                        ON products_table.category_id_ref = categories_table.category_id WHERE category_id_ref = "${req.params.category_id}"`);        

      res.send(allProducts);

    } catch (err) {
      res.status(500).send(err);
    }
});



//------------------------------------------------4-PUT (search a string in the market)---------

router.put("/", usersOnly, async (req, res) => {
    try {
        const { value_in_market } = req.body;      
        
        const matched_products = await myQuery(`SELECT * FROM products_table
                                            LEFT JOIN categories_table
                                            ON products_table.category_id_ref = categories_table.category_id
                                            WHERE product_name LIKE '%${value_in_market}%'`);      

      res.send(matched_products);

    } catch (err) {
      res.status(500).send(err);
    }
});
//--------------------------------------------------export--------------------------
module.exports = router;