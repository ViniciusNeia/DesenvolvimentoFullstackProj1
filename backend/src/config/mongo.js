import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'FullStack';

const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

let dbInstance = null;

async function connect() {
    try {
        if (!dbInstance) {
            await client.connect();
            dbInstance = client.db(dbName);
            console.log('Conectado ao MongoDB com pool de conexões');
        }
        return dbInstance;
    } catch (err) {
        console.error('Erro ao conectar no MongoDB:', err);
        throw err;
    }
}

async function closeConnection() {
    if (client) {
        await client.close();
        dbInstance = null;
        console.log('Conexão com MongoDB fechada');
    }
}

export { connect, closeConnection };


