import mysql2 from "mysql2/promise";

const connectDb = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME,
    });
    console.log(`\n mysql connected !! db Host`, connection.config.host);
    return connection;
  } catch (err) {
    console.log("mysql connection error", err);
    process.exit(1);
  }
};

export default connectDb;
