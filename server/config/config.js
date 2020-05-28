// Puerto
process.env.PORT = process.env.PORT || 3000;


//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vecimiento del token
// s
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// SEED de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

// ID google client
process.env.CLIENT_ID = process.env.CLIENT_ID || '470146084235-c9cih1ajksco4vfqr5l6msgtf5io2ttg.apps.googleusercontent.com';

//Base de datos

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;