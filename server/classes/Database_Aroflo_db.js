// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_aroflo_db";
import UserModel from "../models/Aroflo_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.aroflo_db.host +
        ":" +
        properties.aroflo_db.port +
        "//" +
        properties.aroflo_db.user +
        "@" +
        properties.aroflo_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.aroflo_db.name,
      properties.aroflo_db.user,
      properties.aroflo_db.password,
      {
        host: properties.aroflo_db.host,
        dialect: properties.aroflo_db.dialect,
        port: properties.aroflo_db.port,
        logging: false
      }
    );
    this.dbConnection_aroflo_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_aroflo_db;
  }
}

export default new Database();
