import { Sequelize } from "sequelize";

const persistent_path = ".";

const sequelize = new Sequelize("test-db", "user", "pass", {
    dialect: "sqlite",
    host: persistent_path + "/db.sqlite",
});

export default sequelize;
