const User = require("../../models/User");

// funcion para crear un usuario en testMigrate.js
const userCreate = async () => {
	const user = {
		firstName: "Fede",
		lastName: "Coletto",
		email: "federico.coletto@fce.uncu.edu.ar",
		password: "1234",
		phone: "2612539374",
	};
	await User.create(user);
};

module.exports = userCreate;
