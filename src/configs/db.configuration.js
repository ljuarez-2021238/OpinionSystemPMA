import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.URI_MONGODB, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`Conexion a base de datos exitosa: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('base de datos desconectada exitosamente');
  } catch (error) {
    console.error('Error al desconectar la base de datos:', error.message);
  }
};
