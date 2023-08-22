const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

require("../models");

const users_URL = "/api/v1/users";
const purchase_URL = "/api/v1/purchase";

let TOKEN;
let userId;
let productBody;
let product;
let bodyCart;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};
	const res = await request(app).post(`${users_URL}/login`).send(user);

	TOKEN = res.body.token;
	userId = res.body.user.id;

	productBody = {
		title: "LG Oled",
		description:
			"Samsung TVs are a popular line of television sets produced by the South Korean electronics company, Samsung. Known for their advanced technology, sleek design, and diverse range of models, Samsung TVs offer a variety of features to enhance the viewing experience.",
		price: 1999.99,
	};
	product = await Product.create(productBody);

	bodyCart = {
		quantity: 1,
		productId: product.id,
	};
	await request(app)
		.post("/api/v1/cart")
		.send(bodyCart)
		.set("Authorization", `Bearer ${TOKEN}`);
});

test("POST 'purchase_URL', should return status code 201 and res.body.quantity ===bodyCart.quantity", async () => {
	const res = await request(app)
		.post(purchase_URL)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(201);
	expect(res.body[0].quantity).toBe(bodyCart.quantity);
});

test("GET -> 'purchase_URL',should return status code 200 res.body.length === 1", async () => {
	const res = await request(app)
		.get(purchase_URL)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].userId).toBe(userId);
	expect(res.body[0].product).toBeDefined();
	expect(res.body[0].product.id).toBe(product.id);

	await product.destroy();
});
