import mongoose from 'mongoose';

// connecting db 

export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB CONNECTED : ${connectionInstance.connection.host}` );
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR !!");
    }
};


