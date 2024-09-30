const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.DB_CONNECTION_STRING);

        mongoose.connection.on('connected', () => {
            console.log('Database connection successful');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`Database connection error: ${err}`);
            process.exit(1);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close(() => {
                console.log('Database connection closed due to app termination');
                process.exit(0);
        });
        });
    }
}

module.exports = new Database();