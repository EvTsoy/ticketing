import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT key must be defined');
    }

    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI key must be defined');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB!');
    } catch (err: any) {
        console.error(err.message);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!');
    });
};

start();
