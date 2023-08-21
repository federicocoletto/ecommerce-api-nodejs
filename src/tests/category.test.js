const request = require("supertest");
const app = require("../app");

const users_URL = "/api/v1/users";
const categories_URL = "/api/v1/categories";

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

test("POST -> 'categories_URL', should return status code 201 and res.body.name === category.name", async () => {
	const category = {
		name: "Living Room Furniture",
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

test("GET -> 'categories_URL',should return status code 200 and res.body.length === 1", async () => {
	const res = await request(app)
		.get(categories_URL)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("DELETE -> 'categories_URL/:id',should return status code 204", async () => {
	const res = await request(app)
		.delete(`${categories_URL}/${categoryId}`)
		.set("Authorization", `Bearer ${TOKEN}`);

	expect(res.status).toBe(204);
});