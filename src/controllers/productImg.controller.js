const catchError = require('../utils/catchError');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
	const results = await ProductImg.findAll();
	return res.json(results);
});

module.exports = {
	getAll
}