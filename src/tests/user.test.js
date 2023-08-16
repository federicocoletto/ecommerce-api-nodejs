const request = require("supertest");
const app = require("../app");

const users_URL = "/api/v1/users";
let TOKEN;
let userId;

// hacemos un put de login para antes crear un token para los tests
beforeAll(async () => {
	// el email y password del mismo usuario que creamos en userCreate.js
	const user = {
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
	};

	const res = await request(app).post(`${users_URL}/login`).send(user);

	// accedemos al token creado en el login de user.controller.js
	TOKEN = res.body.token;
});

test("GET --> '/api/v1/users' should return statusCode 200 and res.body.length === 1", async () => {
	const res = await request(app)
	.get(users_URL)
	.set("Authorization", `Bearer ${TOKEN}`);
	
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);
});

test("POST --> '/api/v1/users' should return statusCode 201 and res.body.firstName === user.firstName", async () => {
	const user = {
		firstName: "FCK",
		lastName: "Coletto",
		email: "fedecolettok@gmail.com",
		password: "1234",
		phone: "2612539374",
	};
	
	
	const res = await request(app)
	.post(users_URL)
	.send(user);
	
	userId = res.body.id
	
	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(user.firstName);
});

test("PUT --> '/api/v1/users/:id' should return statusCode 200 and res.body.firstName === userCreate.firstName", async () => {
	const user = {
		firstName: "Federico",
	};
	
	const res = await request(app)
		.put(`${users_URL}/${userId}`)
		.send(user)
		.set("Authorization", `Bearer ${TOKEN}`)

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(user.firstName);
});