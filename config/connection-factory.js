
const mysql = require("mysql2");

module.exports = function () {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pietro09Pisi@", //mano,essa senha e a database vai variar dependendo do banco de dados local,o da escola @ITB123456
    database: "infotur",
    port: 3306,
    authPlugins: {
      mysql_native_password: () => ({ 
        data: Buffer.from(""),
        next: () => null,
      }),
    },
  });
};
