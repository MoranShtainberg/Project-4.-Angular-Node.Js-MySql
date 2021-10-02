const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersOnly, adminsOnly } = require('../middleware/verify_user')
const fs = require('fs/promises');
const fss = require('fs');
const path = require('path');

//--------------------------1-GET: more than 3 orders in a single day--------------------------------------

router.get("/",usersOnly , async (req, res) => {
    try {             
      const more_3_a_day = await myQuery(
        `SELECT delivery_date, COUNT(cart_id) AS numberOfOrders
        FROM carts_table
        GROUP BY DATE(delivery_date)
        HAVING numberOfOrders > 3`
      );           
                                
      console.log(more_3_a_day);

      res.send(more_3_a_day);

    } catch (err) {
      res.status(500).send(err);
    }
});
//------------------------------2-PUT:Order submitting form: Shipping details + credit cart + status: paid--------
router.put("/", usersOnly, async (req, res) => {
  try {      
    const { order_date ,
            delivery_date,
            total_price,
            credit_card_4_last_digits,
            delivery_city,
            delivery_Street} = req.body; 
    
   // fix delivery daye timezone  
    var dt = new Date(delivery_date);
    let fixDelivery = dt.setHours( dt.getHours() + 3 );
    let fixDelivery1= new Date(fixDelivery).toISOString().substring(0, 10)
      console.log("fixDelivery1: "+fixDelivery1)
    
   //get open cart_id for the current user_id 
    const allUserCarts = await myQuery(`SELECT cart_id,user_id_ref,cart_status_table.cart_status FROM carts_table
                                        LEFT JOIN cart_status_table
                                        ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id 
                                        WHERE user_id_ref = ${req.user.user_id} AND cart_status = "open"`);
   
      // console.log("allUserCarts");
      // console.log(allUserCarts);
      // console.log("allUserCarts.length: " +allUserCarts.length);       
      // console.log("allUserCarts[0].cart_id: "+allUserCarts[0].cart_id);
      
   //Order closing 
    if (allUserCarts.length ==1) {  
      await myQuery(`UPDATE carts_table
                      SET cart_status_id_ref = 3, order_date = '${order_date}' ,delivery_date = '${fixDelivery1}',total_price=${total_price},credit_card_4_last_digits=${credit_card_4_last_digits},delivery_city='${delivery_city}',delivery_Street='${delivery_Street}'
                      WHERE cart_id = ${allUserCarts[0].cart_id}`);

   //Receipt processing
      
      const cartProducts = await myQuery(`SELECT * FROM cart_items_bridge_table
                                          LEFT JOIN carts_table
                                          ON cart_items_bridge_table.cart_id_ref = carts_table.cart_id
                                          LEFT JOIN products_table
                                          ON cart_items_bridge_table.product_id_ref = products_table.product_id
                                          WHERE cart_id_ref = ${allUserCarts[0].cart_id}`);
                  
      // console.log(cartProducts);
      // console.log("cartProducts[0].product_name: " +cartProducts[0].product_name);

      //fs1: Name (delivery date + total price) delivery_date
        fss.appendFileSync(path.join(__dirname, `../receipts/${allUserCarts[0].cart_id}.txt`), 

        `Hey ${req.user.first_name} \n
        Here are your order details:\n
        Order date:     ${new Date(order_date).getDate()}/ ${new Date(order_date).getMonth()+1} / ${new Date(order_date).getFullYear()} \n
        Delivery date:  ${new Date(fixDelivery1).getDate()}/ ${new Date(fixDelivery1).getMonth()+1} / ${new Date(fixDelivery1).getFullYear()} \n
        Delivey city: ${delivery_city} \n
        Delivery street: ${delivery_Street} \n
        Total price: ${total_price.toFixed(2)} USD\n
        `
        );

      //fs2: order items loop
        for (let index = 0; index < cartProducts.length; index++) {      
          fss.appendFileSync(path.join(__dirname, `../receipts/${allUserCarts[0].cart_id}.txt`),

          `Product No.${index+1}: ${cartProducts[index].product_name}, Qty: ${cartProducts[index].quantity}, Price (USD): ${cartProducts[index].price_in_usd} ${cartProducts[index].price_type}. Sub total: ${cartProducts[index].price_in_usd * cartProducts[index].quantity} USD \n`)      
        };

    res.status(201).send({'cart_id': allUserCarts[0].cart_id});

    } else{
      res.status(400).send({err: "No cart was found"});
    }

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
//------------------------------------------------3-GET: user address--------
router.get("/address",usersOnly , async (req, res) => {
  try {             
      const userAddress = await myQuery(`SELECT * FROM users_table
                                          WHERE user_id = ${req.user.user_id}`);           

    // console.log("userAddress");
    // console.log(userAddress);

    res.send(userAddress);

  } catch (err) {
    res.status(500).send(err);
  }
});
//----===============================================--GET Receipt-----------------
//------------------------------------GET -- Receipt sandbox------------------
router.get("/receipt",usersOnly , async (req, res) => {
  try {             
    const cartProducts = await myQuery(`SELECT * FROM cart_items_bridge_table
                                          LEFT JOIN carts_table
                                          ON cart_items_bridge_table.cart_id_ref = carts_table.cart_id
                                          LEFT JOIN products_table
                                          ON cart_items_bridge_table.product_id_ref = products_table.product_id
                                          WHERE cart_id_ref = 1`);
                                          // replade 1 -> allUserCarts[0].cart_id
                                          
    console.log(cartProducts);
    console.log(cartProducts[0].product_name);

    //fs1: Name (delivery date + total price)
    fss.appendFileSync(path.join(__dirname, "../receipts/1.txt"), 

        `Hey ${req.user.first_name} \n`
      );

    //fs2: order items loop
    for (let index = 0; index < cartProducts.length; index++) {      
      fss.appendFileSync(path.join(__dirname, "../receipts/1.txt"),

      `Product No.${index}: ${cartProducts[index].product_name}, Qty: ${cartProducts[index].quantity}, Price (USD): ${cartProducts[index].price_in_usd} ${cartProducts[index].price_type}. Sub total: ${cartProducts[index].price_in_usd * cartProducts[index].quantity} USD \n`)      
    };

    res.send(cartProducts);

  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------------------------export------------------

module.exports = router;