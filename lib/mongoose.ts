import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async() => {

    mongoose.set('strictQuery',true);
    
    if(!process.env.MONGODB_URL) {
        console.log('MONGODB uri not defined')
    }

    if(isConnected) return console.log('=> using existing database connection')

    try {
        mongoose.connect(process.env.MONGODB_URL as string);
        isConnected = true;

        console.log('connected to database');

    } catch(error:any) {
        console.log(error.message);
    }
}