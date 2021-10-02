const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersOnly, adminsOnly } = require('../middleware/verify_user')


//-------------------------------------------1-Post: Creat a new cart for the user_id if there is no open cart--------
router.post("/", usersOnly, async (req, res) => {
    try {                  
      //get "open" carts for the current user_id 
          const allUserCarts = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                                LEFT JOIN cart_status_table
                                                ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                                WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);                              
        
        // console.log("is it open: " + allUserCarts[0].cart_status);
        // console.log("cart_id: " + allUserCarts[0].cart_id);
        console.log(allUserCarts);
        console.log(allUserCarts.length);
                 
        //if length == 0 -> create a new cart for the user_id
        if (allUserCarts.length == 0) {
            await myQuery(`INSERT INTO carts_table(user_id_ref,cart_status_id_ref) 
                                            VALUES (${req.user.user_id},1)`);

            res.status(201).send();            
        } else if (allUserCarts.length ==1) {
            res.status(200).send({c_id: allUserCarts[0].cart_id})
        } else{
            res.status(404).send({err: "unknown error. There is more than 1 open cart"}) 
        }

    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  });

//------------------------------------------------2-GET/Number Of Products in the store----

router.get("/numberOfProducts", async (req, res) => {
  try { 
    
    const numberOfProducts = await myQuery(`SELECT COUNT(product_id) AS NumberOfProducts FROM products_table`);           
    //console.log(...numberOfProducts);
    res.send(...numberOfProducts);

  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------------------------------------3-GET/Number Paid carts----------------

router.get("/numberOfpaidCarts", async (req, res) => {
  try {
     
    // query 1
      const numberOfpaidCarts = await myQuery(`SELECT COUNT(cart_id) AS numberOfpaidCarts FROM carts_table
                                              LEFT JOIN cart_status_table
                                              ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id      
                                              WHERE cart_status_table.cart_status LIKE '%Paid%' `);           
    //console.log(...numberOfpaidCarts);
    res.send(...numberOfpaidCarts);

  } catch (err) {
    res.status(500).send(err);
  }
});
//-------------------------------------------4-GET: user "Open" Cart Date (created date)--------
router.get("/openCartDate", usersOnly, async (req, res) => {
  try {       
    // query 1
      const openCartDate = await myQuery(`SELECT cart_created_date FROM carts_table
                                            LEFT JOIN cart_status_table
                                            ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id      
                                            WHERE cart_status_table.cart_status = 'open' AND user_id_ref =${req.user.user_id}`);           
    //console.log(...openCartDate);
    //console.log(openCartDate.length);

    if (openCartDate.length == 1) {
      res.send(...openCartDate);      
    } else {
      res.status(400).send({err:"No open cart"})
    }

  } catch (err) {
    res.status(500).send(err);
  }
});

//-------------------------------------------5-GET: Last Purchase /Last "Paid" cart date--------
router.get("/lastOrderDate", usersOnly, async (req, res) => {
  try {       
    // query 1
      const lastOrderDate = await myQuery(`SELECT MAX(order_date) AS lastOrderDate FROM carts_table
                                            LEFT JOIN cart_status_table
                                            ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id      
                                            WHERE cart_status_table.cart_status LIKE '%Paid%' AND user_id_ref =${req.user.user_id}`);           
    //console.log(lastOrderDate[0].lastOrderDate);
    //console.log(lastOrderDate.length);

    if (lastOrderDate.length == 1 && lastOrderDate[0].lastOrderDate !== null ) {
      res.send(...lastOrderDate);
      console.log(...lastOrderDate);      
    } else {
      res.status(400).send({err:"No paid carts"})
    }

  } catch (err) {
    res.status(500).send(err);
  }
});

//--------------------------------------------------6. GET: open cart info for "resume Or Open btn" quastion-----
router.get("/resumeOrOpen", usersOnly, async (req, res) => {
  try {    
    //get "open" carts for the current user_id 
      const user_id_open_cart = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                            LEFT JOIN cart_status_table
                                            ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                            WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);                              

        
        //console.log(user_id_open_cart);
        //console.log("user_id_open_cart_length: "+user_id_open_cart.length);
        //console.log("user_id_open_cart_id: "+user_id_open_cart[0].cart_id);

        let user_id_OpenCartID
        if (user_id_open_cart.length == 0) {
          user_id_OpenCartID = 0;
        } else {
          user_id_OpenCartID = user_id_open_cart[0].cart_id;
        }

        console.log("user_id_OpenCartID: "+user_id_OpenCartID);

        res.send(
          {
          user_id_open_cart_length: user_id_open_cart.length,
          user_id_OpenCartID: user_id_OpenCartID
          }
        );

  } catch (err) {
    res.status(500).send(err);
  }
});
//--------------------------------------------------export--------------------------

module.exports = router;