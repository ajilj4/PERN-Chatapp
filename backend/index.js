require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')

const sequelize = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('✅ API is working!'));

const server = http.createServer(app)

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected');
    await sequelize.sync({ alter: true });
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
  }
})();
