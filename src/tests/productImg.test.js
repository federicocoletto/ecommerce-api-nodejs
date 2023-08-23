const request = require("supertest");
const app = require("../app");
const path = require("path");
const { log } = require("console");
require("../models");

const productImg_URL = "/api/v1/product_images";
const userLogin_URL = "/api/v1/users/login";
let TOKEN;
// let category;
let productImgId;
// let productImgId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};

	const res = await request(app).post(userLogin_URL).send(user);

	TOKEN = res.body.token;
});

test("POST -> 'productImg_URL', should resturn status code 201 and res.body.url to be defined & res.body.file to be defined", async () => {
	const localImage = path.join(__dirname, "..", "public", "test.jpg");
	const res = await request(app)
		.post(productImg_URL)
		.attach("image", localImage)
		.set("Authorization", `Bearer ${TOKEN}`);

	productImgId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.url).toBeDefined();
	expect(res.body.filename).toBeDefined();
});

test("GET -> 'productImg_URL', should resturn status code 201", async () => {
	const res = await request(app)
	.get(productImg_URL)
	.set("Authorization", `Bearer ${TOKEN}`);
	
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("DELETE -> 'productImg_URL:/id', should resturn status code 204", async () => {
	const res = await request(app)
		.delete(`${productImg_URL}/${productImgId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
});