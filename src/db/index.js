import mysql2 from "mysql2/promise";

const connectDb = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: "127.0.0.1",
      user: "root",
      password: "Mysql@7675",
      database: "event_management_db_with_node",
    });
    console.log(`\n mysql connected !! db Host`, connection.config.host);
    return connection;
  } catch (err) {
    console.log("mysql connection error", err);
    process.exit(1);
  }
};

export default connectDb;
