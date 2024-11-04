import sequelize from '../config/database';

export const loadDatabase = async () => {
    await sequelize.authenticate()
        .then(() => {
            console.log(`\x1b[32m%s\x1b[0m`, `Connected to Database!`);
        })
        .catch((err) => {
            throw new Error(err);
        });

    //await sequelize.drop();
    //    console.log(`\x1b[32m%s\x1b[0m`, `Database cleared!`);
    
    await sequelize.sync({ alter: true })
        .then(() => {
            console.log(`\x1b[32m%s\x1b[0m`, `Tables Synchronized!`);
        })
        .catch((err) => {
            throw new Error(err);
        });
}