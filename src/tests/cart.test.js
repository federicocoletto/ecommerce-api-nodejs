const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const users_URL = "/api/v1/users";
const cart_URL = "/api/v1/cart";

let TOKEN;
let productBody;
let product;
let userId;
let cartId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};
	const res = await request(app).post(`${users_URL}/login`).send(user);

	TOKEN = res.body.token;
	userId = res.body.user.id;

	productBody = {
		title: "Samsung HD 55",
		description:
			"Samsung TVs are a popular line of television sets produced by the South Korean electronics company, Samsung. Known for their advanced technology, sleek design, and diverse range of models, Samsung TVs offer a variety of features to enhance the viewing experience.",
		price: 999.99,
	};

	product = await Product.create(productBody);
});

test("POST -> 'cart_URL', should return status code 201 and res.body.quantity === bodyCart.quantity", async () => {
	const bodyCart = {
		quantity: 1,
		productId: product.id,
	};

	const res = await request(app)
		.post(cart_URL)
		.send(bodyCart)
		.set("Authorization", `Bearer ${TOKEN}`);

	cartId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.quantity).toBe(bodyCart.quantity);
	expect(res.body.id).toBe(cartId);
});

test("GET -> 'cart_URL',should return status code 200 and res.body.length === 1", async () => {
	const res = await request(app)
		.get(cart_URL)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].userId).toBe(userId);
	expect(res.body[0].product).toBeDefined();
	expect(res.body[0].productId).toBe(product.id);
	expect(res.body[0].product.id).toBe(product.id);
	expect(res.body[0].product.productImgs).toBeDefined();
	expect(res.body[0].product.productImgs).toHaveLength(0);
});

test("PUT -> 'cart_URL/:id',should return status code 200 and res.body.quantity === bodyUpdate.quantity", async () => {
	const cartUpdate = {
		quantity: 2,
	};

	const res = await request(app)
		.put(`${cart_URL}/${cartId}`)
		.send(cartUpdate)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.quantity).toBe(cartUpdate.quantity);
});

test("DELETE -> 'cart_URL/:id',should return status code 204", async () => {
	const res = await request(app)
		.delete(`${cart_URL}/${cartId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
	await product.destroy();
});
