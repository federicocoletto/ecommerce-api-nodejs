const express = require('express');
const routerUser = require('./user.router');
const routerCategory = require('./category.router');
const routerProduct = require('./product.router');
const router = express.Router();

// users
router.use("/users", routerUser)
// categories
router.use("/categories", routerCategory)
// products
router.use('/products', routerProduct)

module.exports = router;