import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import env from './env';
import usersRoute from './app/routes/usersRoutes';
import adminRoute from './app/routes/adminRoutes';
import tripRoute from './app/routes/tripRoutes';
import busRoute from './app/routes/busRoutes';
import bookingRoute from './app/routes/bookingRouter';

const app = express();
//add middleware
app.use(cors());

//add middleware for JSON Parsing and URLencode req.body
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.post('/api/v1', usersRoute);
app.use('/api/v1', adminRoute);
app.use('/api/v1', tripRoute);
app.use('/api/v1', busRoute);
app.use('/api/v1', bookingRoute);

app.listen(env.port).on('listening', ()=>{
    console.log(`You are on ${env.port}`);
});

