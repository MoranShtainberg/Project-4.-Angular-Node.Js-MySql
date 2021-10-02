const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersOnly, adminsOnly } = require('../middleware/verify_user')


//------------------------------------------------1-delete all cart items given cart_id--------
router.delete("/", usersOnly, async (req, res) => {
    try {      
      //const { cart_id_ref } = req.body; 
      
     //get all carts for a current user_id 
          const allUserCarts = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                                LEFT JOIN cart_status_table
                                                ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                                WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);

        // console.log("is it open: " + allUserCarts[0].cart_status);
        // console.log("cart_id: " + allUserCarts[0].cart_id);
        // console.log(allUserCarts);
        // console.log(allUserCarts.length);          
        
     //Delete all cart_id items  
      if (allUserCarts.length == 1) {  
        await myQuery(`DELETE FROM cart_items_bridge_table 
                        WHERE cart_id_ref =${ allUserCarts[0].cart_id }`);

        res.status(201).send()
      } else{
        res.status(400).send({err: "No cart was found"})
      }
  
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  });

//------------------------------------------------2-delete single cart item given cart_id and product_id--------
router.delete("/:product_id", usersOnly, async (req, res) => {
  try {      
    //const { cart_id_ref } = req.body; 
    
   //get all carts for a current user_id 
        const allUserCarts = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                              LEFT JOIN cart_status_table
                                              ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                              WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);

      // console.log("is it open: " + allUserCarts[0].cart_status);
      // console.log("cart_id: " + allUserCarts[0].cart_id);
      console.log("all open User Carts:");
      console.log(allUserCarts);
      console.log("allUserCarts.length: "+allUserCarts.length);
  
     
   //delete 
    if (allUserCarts.length ==1) {  
      await myQuery(`DELETE FROM cart_items_bridge_table 
                      WHERE cart_id_ref =${ allUserCarts[0].cart_id } AND product_id_ref = ${ req.params.product_id }`);

      res.status(201).send()
    } else{
      res.status(400).send({err: "No cart was found"})
    }

  } catch (err) {
      console.log(err)
      res.status(500).send(err);
  }
});

//------------------------------------------------3-GET (all cart items given cart_id)---------
router.get("/", usersOnly, async (req, res) => {
  try {    
    //get "open" carts for the current user_id 
      const user_id_open_cart = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                            LEFT JOIN cart_status_table
                                            ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                            WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);                              

        
        console.log(user_id_open_cart);
        console.log("user_id_open_cart_length: "+user_id_open_cart.length);
        //console.log("user_id_open_cart_id: "+user_id_open_cart[0].cart_id);

        let user_id_OpenCartID
        if (user_id_open_cart.length == 0) {
          res.status(400).send({user_id_open_cart_length: user_id_open_cart.length});
          
        } else {
          user_id_OpenCartID = user_id_open_cart[0].cart_id;
          console.log("user_id_OpenCartID: "+user_id_OpenCartID);  

          const cartProducts = await myQuery(`SELECT * FROM cart_items_bridge_table
                                              LEFT JOIN carts_table
                                              ON cart_items_bridge_table.cart_id_ref = carts_table.cart_id
                                              LEFT JOIN products_table
                                              ON cart_items_bridge_table.product_id_ref = products_table.product_id
                                              WHERE cart_id_ref = ${user_id_OpenCartID}`);           

          res.send(cartProducts);
        }

  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------------------------------------4-GET: return single product details--------------------------
router.get("/product_id/:product_id", adminsOnly, async (req, res) => {
  try {         
      const product_datails = await myQuery(`SELECT * FROM products_table
                                            LEFT JOIN categories_table
                                            ON products_table.category_id_ref = categories_table.category_id
                                            WHERE product_id = ${req.params.product_id}`);   
      res.send(product_datails);

  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------------------------------------5-POST: Add a product to cart (cart_items_bridge_table)--------
router.post("/add_product_to_cart", usersOnly, async (req, res) => {
  try {      
    const { product_id_ref, quantity } = req.body; 
    
   //get all open carts for a current user_id 
      const allUserCarts = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                          LEFT JOIN cart_status_table
                                          ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                          WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);

      // console.log("is it open: " + allUserCarts[0].cart_status);
      // console.log("cart_id: " + allUserCarts[0].cart_id);
      // console.log(allUserCarts);
      // console.log(allUserCarts.length);

    let cart_id_items
    if (allUserCarts.length == 1) { // a client should have only 1 open cart
      cart_id_items = await myQuery(`SELECT * FROM cart_items_bridge_table
                                    WHERE cart_id_ref= ${allUserCarts[0].cart_id}`);

              if (cart_id_items.some((item)=> item.product_id_ref  === product_id_ref)) {
                //update quantity + res 201
                  await myQuery(`UPDATE cart_items_bridge_table
                                SET quantity = ${quantity}
                                WHERE cart_id_ref = ${allUserCarts[0].cart_id} AND product_id_ref = ${product_id_ref}`);

                  res.status(201).send();
              } else{
                //insert+ res 201
                await myQuery(`INSERT INTO cart_items_bridge_table(cart_id_ref,product_id_ref,quantity)
                                            VALUES (${allUserCarts[0].cart_id},${product_id_ref},${quantity})`);
                  res.status(201).send();
              };
      } else{
        res.status(400).send({err: "No cart was found"});
      }


  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});
//------------------------------------------------6-POST: create a product (ADMIN)--------
router.post("/", adminsOnly, async (req, res) => {
  try {      
    const { product_name, category_id_ref, price_in_usd, price_type, picture_url} = req.body;     
    
    await myQuery(`INSERT INTO products_table(product_name,category_id_ref,price_in_usd,price_type,picture_url)
                    VALUES ("${product_name}",${category_id_ref},${price_in_usd},"${price_type}","${picture_url}")`);

    res.status(201).send()  

  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});
//------------------------------------------------7-PUT: edit a product (ADMIN)--------
router.put("/", adminsOnly, async (req, res) => {
  try {      
    const { product_id ,product_name, category_id_ref, price_in_usd, price_type, picture_url} = req.body;     
    
    await myQuery(`UPDATE products_table
                  SET product_name = '${product_name}', category_id_ref= ${category_id_ref},price_in_usd=${price_in_usd},price_type="${price_type}",picture_url="${picture_url}"
                  WHERE product_id = ${product_id}`);

    res.status(201).send()  

  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
});

//-------------------------------------------------export-------------------------------------
module.exports = router;