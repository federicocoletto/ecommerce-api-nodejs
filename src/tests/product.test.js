const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
require("../models");

const URL_BASE = "/api/v1/products";
const URL_BASE_USER = "/api/v1/users/login";
let TOKEN;
let product;
let category;
let productId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};
	const res = await request(app).post(URL_BASE_USER).send(user);

	TOKEN = res.body.token;

	const categoryBody = {
		name: "Smarts",
	};

	category = await Category.create(categoryBody);

	product = {
		title: "Industrial Style Reclaimed Oak Coffee Table",
		description:
			"The industrial coffee table combines reclaimed oak wood and sturdy metal for a unique and durable look.",
		price: 249.0,
		categoryId: category.id,
	};
});

test("POST -> 'URL_BASE', should resturn status code 201 and res.body.title = product.title", async () => {
	const res = await request(app)
		.post(URL_BASE)
		.send(product)
		.set("Authorization", `Bearer ${TOKEN}`);

	productId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);
});

test("GET -> 'URL_BASE', should resturn status code 200 and res.body.legnth = 1", async () => {
	const res = await request(app).get(URL_BASE);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].category).toBeDefined();
	expect(res.body[0].category.id).toBe(category.id);
});

test("GET -> 'URL_BASE?category=id', should resturn status code 200 and res.body.legnth = 1, res.body[0].category to be defined and res.body[0].category = category.id", async () => {
	const res = await request(app) // /api/v1/products?category=1
		.get(`${URL_BASE}?category=${category.id}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].category).toBeDefined();
	expect(res.body[0].category.id).toBe(category.id);
});

test("GET ONE -> 'URL_BASE/:id', should resturn status code 200 and res.body.title = product.title", async () => {
	const res = await request(app).get(`${URL_BASE}/${productId}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);
});

test("PUT -> 'URL_BASE/:id', should resturn status code 200 and res.body.title = productUpdate.title", async () => {
	const productUpdate = {
		title: "Samsung oled 55",
	};

	const res = await request(app)
		.put(`${URL_BASE}/${productId}`)
		.send(productUpdate)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(productUpdate.title);
});

test("DELET -> 'URL_BASE/:id', should resturn status code 204", async () => {
	const res = await request(app)
		.delete(`${URL_BASE}/${productId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);

	await category.destroy();
});
