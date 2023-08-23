const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");
require("../models");

const products_URL = "/api/v1/products";
const usersLogin_URL = "/api/v1/users/login";
let TOKEN;
let product;
let category;
let productId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};
	const res = await request(app).post(usersLogin_URL).send(user);

	TOKEN = res.body.token;

	const categoryBody = {
		name: "Living Room Furniture",
	};

	category = await Category.create(categoryBody);

	product = {
		title: "Style Reclaimed Oak Coffee Table",
		description:
			"The industrial coffee table combines reclaimed oak wood and sturdy metal for a unique and durable look.",
		price: 249.0,
		categoryId: category.id,
	};
});

test("POST -> 'products_URL', should resturn status code 201 and res.body.title = product.title", async () => {
	const res = await request(app)
		.post(products_URL)
		.send(product)
		.set("Authorization", `Bearer ${TOKEN}`);

	productId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);
});

test("GET -> 'products_URL', should resturn status code 200 and res.body.legnth = 1", async () => {
	const res = await request(app).get(products_URL);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].category).toBeDefined();
	expect(res.body[0].category.id).toBe(category.id);
});

test("GET -> 'products_URL?category=id', should resturn status code 200 and res.body.legnth = 1, res.body[0].category to be defined and res.body[0].category = category.id", async () => {
	const res = await request(app) 
		.get(`${products_URL}?category=${category.id}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
	expect(res.body[0].category).toBeDefined();
	expect(res.body[0].category.id).toBe(category.id);
});

test("GET ONE -> 'products_URL/:id', should resturn status code 200 and res.body.title = product.title", async () => {
	const res = await request(app).get(`${products_URL}/${productId}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(product.title);
});

test("POST -> 'products_URL/:id/images', should return status code 200 and res.body.length ===1", async () => {
	const imageBody = {
		url: "../public",
		filename: "test.jpg",
	};

	image = await ProductImg.create(imageBody);

	const res = await request(app)
		.post(`${products_URL}/${productId}/images`)
		.send([image.id])
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("PUT -> 'products_URL/:id', should resturn status code 200 and res.body.title = productUpdate.title", async () => {
	const productUpdate = {
		title: "Industrial Style Reclaimed Oak Coffee Table",
	};

	const res = await request(app)
		.put(`${products_URL}/${productId}`)
		.send(productUpdate)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.title).toBe(productUpdate.title);
});

test("DELET -> 'products_URL/:id', should resturn status code 204", async () => {
	const res = await request(app)
		.delete(`${products_URL}/${productId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);

	await category.destroy();
});
