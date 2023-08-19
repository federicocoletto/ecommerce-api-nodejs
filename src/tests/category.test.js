const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const users_URL = "/api/v1/users";
const category_URL = "/api/v1/cart";

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
		title: "productTest",
		description: "lorem20",
		price: 23,
	};

	product = await Product.create(productBody);
});

test("POST -> 'category_URL', should return status code 201 and res.body.quantity === bodyCart.quantity", async () => {
	const bodyCart = {
		quantity: 1,
		productId: product.id,
	};

	const res = await request(app)
		.post(category_URL)
		.send(bodyCart)
		.set("Authorization", `Bearer ${TOKEN}`);

	cartId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.quantity).toBe(bodyCart.quantity);
	expect(res.body.id).toBe(userId);
});

test("GET -> 'category_URL',should return status code 200 and res.body.length === 1", async () => {
	const res = await request(app)
		.get(category_URL)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].userId).toBe(userId);
	expect(res.body[0].product).toBeDefined();
	expect(res.body[0].productId).toBe(product.id);
	expect(res.body[0].product.id).toBe(product.id);
});

test("PUT -> 'category_URL/:id',should return status code 200 and res.body.quantity === bodyUpdate.quantity", async () => {
	const bodyUpdate = {
		quantity: 2,
	};

	const res = await request(app)
		.put(`${category_URL}/${cartId}`)
		.send(bodyUpdate)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.quantity).toBe(bodyUpdate.quantity);
});

test("DELETE -> 'category_URL/:id',should return status code 204", async () => {
	const res = await request(app)
		.delete(`${category_URL}/${cartId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
	await product.destroy();
});
