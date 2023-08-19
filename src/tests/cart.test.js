/*
const request = require("supertest");
const app = require("../app");

const cart_URL = "/api/v1/cart";
const users_URL = "/api/v1/users";
let TOKEN;
let cartId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};
	
	const res = await request(app).post(`${users_URL}/login`).send(user);
	
	TOKEN = res.body.token;
});

test("POST --> '/api/v1/cart' should return statusCode 201 and res.body.name === body.name", async () => {
	const cart = {
		name: "Smart TV",
	};

	const res = await request(app)
		.post(cart_URL)
		.send(cart)
		.set("Authorization", `Bearer ${TOKEN}`);

	cartId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.name).toBe(cart.name);
});

test("GET --> '/api/v1/cart' should return statusCode 200 and res.body.length === 1", async () => {
	const res = await request(app)
	.get(cart_URL)
	
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("DELETE --> '/api/v1/cart/:id' should return statusCode 204", async () => {
	const res = await request(app)
		.delete(`${cart_URL}/${cartId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
});
*/