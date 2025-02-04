const express = require('express');
const morgan = require('morgan');

const app = express();

const {PORT} = require('./config/serverConfig');

const apiRoutes = require('./routes/index');

const db = require('./models/index');

const setupAndStartServer = ()=>{

    app.use(morgan('dev'));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use('/api',apiRoutes);

    app.listen(PORT,()=>{
        console.log('Server started at port:', PORT);

        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }
    }) 
}

setupAndStartServer();