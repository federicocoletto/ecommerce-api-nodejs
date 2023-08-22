const { getAll } = require('../controllers/productImg.controller');
const express = require('express');

const routerProductImg = express.Router();

routerProductImg.route('/')
	.get(getAll)

module.exports = routerProductImg;