const express = require('express');

const { verifyJwt } = require('../utils/verifyJWT');

const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const routerCart = require('./cart.router');
const routerPurchase = require('./purchase.router');
const routerProductImg = require('./productImg.router');

const router = express.Router();

// users
router.use("/users", routerUser)
// categories
router.use("/categories", routerCategory)
// products
router.use('/products', routerProduct)
// cart
router.use("/cart", verifyJwt, routerCart); // 🔒
// purchase
router.use("/purchase", verifyJwt, routerPurchase); // 🔒
// productImg
router.use("/product_images", verifyJwt, routerProductImg); // 🔒

module.exports = router;