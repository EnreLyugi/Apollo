import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
});

export default sequelize;