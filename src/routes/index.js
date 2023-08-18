const express = require('express');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const routerCart = require('./cart.router');
const { verifyJwt } = require('../utils/verifyJWT');
const router = express.Router();

// users
router.use("/users", routerUser)
// categories
router.use("/categories", routerCategory)
// products
router.use('/products', routerProduct)
// cart
router.use("/cart", verifyJwt, routerCart); // 🔒

module.exports = router;