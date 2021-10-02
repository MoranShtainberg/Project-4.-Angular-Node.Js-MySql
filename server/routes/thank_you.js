const router = require('express').Router();
const { myQuery } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usersOnly, adminsOnly } = require('../middleware/verify_user')

//--------------------------1-GET: invoice_information------------------
//http://localhost:1000/api/thank_you/6

router.get("/:cart_id",usersOnly , async (req, res) => {
    try {             
        const invoice_information = await myQuery(`SELECT * FROM carts_table
                                                    LEFT JOIN cart_status_table
                                                    ON carts_table.cart_status_id_ref = cart_status_table.cart_status_id
                                                    WHERE cart_id = ${req.params.cart_id} AND user_id_ref = ${req.user.user_id}`);           

      res.send(invoice_information);

    } catch (err) {
      res.status(500).send(err);
    }
});

//--------------------------------------------------export--------------------------
module.exports = router;