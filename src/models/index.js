const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
const ProductImg = require("./ProductImg");
const Purchase = require("./Purchase");
const User = require("./User");

// Product --> categoryId (fk)
Product.belongsTo(Category);
Category.hasMany(Product);

// Cart --> userId (fk)
Cart.belongsTo(User);
User.hasMany(Cart);

// Cart --> productId (fk)
Cart.belongsTo(Product);
Product.hasMany(Cart);

// Purchase --> userId (fk)
Purchase.belongsTo(User);
User.hasMany(Purchase);

// Purchase --> ProductId (fk)
Purchase.belongsTo(Product);
Product.hasMany(Purchase);

ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)