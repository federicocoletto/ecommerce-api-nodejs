const request = require("supertest");
const app = require("../app");

const categories_URL = "/api/v1/categories";
const users_URL = "/api/v1/users";
let TOKEN;
let categoryId;

beforeAll(async () => {
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};

	const res = await request(app).post(`${users_URL}/login`).send(user);

	TOKEN = res.body.token;
});

test("POST --> '/api/v1/categories' should return statusCode 201 and res.body.name === body.name", async () => {
	const category = {
		name: "Hogar",
	};

	const res = await request(app)
		.post(categories_URL)
		.send(category)
		.set("Authorization", `Bearer ${TOKEN}`);

	categoryId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.name).toBe(category.name);
});

test("GET --> '/api/v1/categories' should return statusCode 200 and res.body.length === 1", async () => {
	const res = await request(app)
	.get(categories_URL)
	
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("DELETE --> '/api/v1/categories/:id' should return statusCode 204", async () => {
	const res = await request(app)
		.delete(`${categories_URL}/${categoryId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
});