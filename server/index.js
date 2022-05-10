require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookeParser = require('cookie-parser');
const router = require('./router/index')
const errorMiddleware = require('./middleware/errorMiddleware');

const sequelize = require('./db');
const models = require('./models/models')



const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookeParser());
app.use(cors());
app.use('/api',router)

app.use(errorMiddleware)

const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT,()=>{
            console.log('app started on port: '+ PORT)
        })
    }catch(e){
        console.log(e);
    }
}

start();