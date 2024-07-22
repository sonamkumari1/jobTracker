// db.js
import mongoose from 'mongoose';
import colors from 'colors';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB Database ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`MongoDB Error: ${error}`.bgRed.white);
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
