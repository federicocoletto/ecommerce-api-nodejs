const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
const User = require("./User");

// Product --> categoryId (fk)
Product.belongsTo(Category);
Category.hasMany(Product);

// Cart --> userId (fk)
Cart.belongsTo(User);
User.hasOne(Cart);

// Cart --> productId (fk)
Cart.belongsTo(Product);
Product.hasMany(Cart);
