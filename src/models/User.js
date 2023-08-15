const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
	firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	phone: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
});

// eliminamos 'password' al crear el usuario
User.prototype.toJson = function () {
	const values = { ...this.get() };
	delete values.password;
	return values;
};

// encriptamos la contraseña antes de crear el usuario
User.beforeCreate(async (user) => {
	const hashedPassword = await bcrypt.hash(user.password, 10);
	user.password = hashedPassword;
});

module.exports = User;