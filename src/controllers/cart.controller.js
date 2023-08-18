const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");

const getAll = catchError(async (req, res) => {
	// traer los productos en el carrito del usuario loggeado
	const userId = req.user.id;
	const results = await Cart.findAll({
		where: { userId },
		include: [
			{
				model: Product,
				attributes: { exclude: ["createdAt", "updatedAt"] },
				include: [
					{
						model: Category,
						attributes: ["name"],
					},
				],
			},
		],
	});
	return res.json(results);
});

const create = catchError(async (req, res) => {
	const userId = req.user.id;
	//  agregar los productos y cantidad deseados por el usuario loggeado en el carrito
	const { quantity, productId } = req.body;
	const body = {
		quantity,
		productId,
		userId,
	};
	const result = await Cart.create(body);
	return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
	const { id } = req.params;
	// eliminar los productos deseados por el usuario loggeado en el carrito
	const result = await Cart.destroy({ where: { id, userId: req.user.id } });
	if (!result) return res.sendStatus(404);
	return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
	const { id } = req.params;
	// actualizar la cantidad
	const { quantity } = req.body;
	const result = await Cart.update(
		{ quantity },
		{
			where: { id, userId },
			returning: true,
		}
	);
	if (result[0] === 0) return res.sendStatus(404);
	return res.json(result[1][0]);
});

module.exports = {
	getAll,
	create,
	remove,
	update,
};
