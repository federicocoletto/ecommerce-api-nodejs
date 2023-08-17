const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
require("../models");

const products_URL = "/api/v1/products";
const users_URL = "/api/v1/users";
let TOKEN;
let product;
let category;
let productId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};

	const res = await request(app).post(`${users_URL}/login`).send(user);

	TOKEN = res.body.token;

	const categoryBody = {
		name: "Smart TV",
	};

	category = await Category.create(categoryBody);

	product = {
		title: "Samsung HD 55",
		description:
			"Samsung TVs are a popular line of television sets produced by the South Korean electronics company, Samsung. Known for their advanced technology, sleek design, and diverse range of models, Samsung TVs offer a variety of features to enhance the viewing experience.",
		price: 999.99,
		categoryId: category.id,
	};
});

test("POST --> '/api/v1/products' should return statusCode 201 and res.body.name === body.name", async () => {
	const res = await request(app)
		.post(products_URL)
		.send(product)
		.set("Authorization", `Bearer ${TOKEN}`);

	productId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);

	await category.destroy();
});

test("GET --> '/api/v1/products' should return statusCode 200 and res.body.length === 1", async () => {
	const res = await request(app).get(products_URL);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("GET ONE --> '/api/v1/products/:id' should return statusCode 200 and res.body.length === 1", async () => {
	const res = await request(app)
		.get(`${products_URL}/${productId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

		console.log(res.body);
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);
});

test("PUT --> '/api/v1/products/:id' should return statusCode 200 and res.body.firstName === userCreate.firstName", async () => {

	const productUpdate = {
		title: "Samsung HD 60",
	};

	const res = await request(app)
		.put(`${products_URL}/${productId}`)
		.send(productUpdate)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(productUpdate.title);
});

test("DELETE --> '/api/v1/products/:id' should return statusCode 204", async () => {
	const res = await request(app)
		.delete(`${products_URL}/${productId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
});
