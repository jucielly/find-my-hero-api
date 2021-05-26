module.exports = {
  port: +process.env.PORT,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
  },
  saltRounds: +process.env.SALT_ROUNDS,
  jwtSecret: process.env.JWT_SECRET,
  marvel: {
    publicKey: process.env.MARVEL_PUBLIC_KEY,
    privateKey: process.env.MARVEL_PRIVATE_KEY,
  },

};
