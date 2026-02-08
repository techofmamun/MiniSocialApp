const app = require('../src/app');
const connectDB = require('../src/config/database');

connectDB();

module.exports = app;

