const DataTypes = require("sequelize").DataTypes;
const _board = require("./board");
const _board_type = require("./board_type");
const _comments = require("./comments");
const _orders = require("./orders");
const _products = require("./products");
const _regions = require("./regions");
const _stores = require("./stores");
const _users = require("./users");

function initModels(sequelize) {
    const board = _board(sequelize, DataTypes);
    const board_type = _board_type(sequelize, DataTypes);
    const comments = _comments(sequelize, DataTypes);
    const orders = _orders(sequelize, DataTypes);
    const products = _products(sequelize, DataTypes);
    const regions = _regions(sequelize, DataTypes);
    const stores = _stores(sequelize, DataTypes);
    const users = _users(sequelize, DataTypes);

    comments.belongsTo(board, {as: "b_no_board", foreignKey: "b_no"});
    board.hasMany(comments, {as: "comments", foreignKey: "b_no"});
    board.belongsTo(board_type, {as: "bt_no_board_type", foreignKey: "bt_no"});
    board_type.hasMany(board, {as: "boards", foreignKey: "bt_no"});
    orders.belongsTo(products, {as: "p_no_product", foreignKey: "p_no"});
    products.hasMany(orders, {as: "orders", foreignKey: "p_no"});
    stores.belongsTo(regions, {as: "r_no_region", foreignKey: "r_no"});
    regions.hasMany(stores, {as: "stores", foreignKey: "r_no"});
    products.belongsTo(stores, {as: "s_no_store", foreignKey: "s_no"});
    stores.hasMany(products, {as: "products", foreignKey: "s_no"});
    board.belongsTo(users, {as: "u_no_user", foreignKey: "u_no"});
    users.hasMany(board, {as: "boards", foreignKey: "u_no"});
    comments.belongsTo(users, {as: "u_no_user", foreignKey: "u_no"});
    users.hasMany(comments, {as: "comments", foreignKey: "u_no"});
    orders.belongsTo(users, {as: "u_no_user", foreignKey: "u_no"});
    users.hasMany(orders, {as: "orders", foreignKey: "u_no"});

    return {
        board,
        board_type,
        comments,
        orders,
        products,
        regions,
        stores,
        users,
    };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
