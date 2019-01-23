// Reuires
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const path = require('path');
const configs = require('./config');

/* db.authenticate()
    .then( () => console.log('DB Conectada correctamente'))
    .catch( err => console.error(err)); */


// Configurar express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Añadir las vistas
app.set('views', path.join(__dirname, './views'));

// Cargar una carpeta estática llamada public
app.use(express.static('public'));

// Validar si estamos en desarrollo o en producción
const config = configs[app.get('env')];

// Creamos la variable para el sitio web
app.locals.titulo = config.nombresitio;

// Crear variables locales de node
app.use( (req, res, next) => {
    // Crear nueva fecha
    const fecha = new Date();
    res.locals.fechaActual = fecha.getFullYear();
    // Variable para obtener la ruta
    res.locals.ruta = req.path;
    return next();
});

// Usar body parser
app.use(bodyParser.urlencoded({extended: true}));

// Cargar rutas
app.use('/', routes);


app.listen(3000, err => {
    if (err) throw Error;

    console.log('Servidor escuchando el puerto 3000');
});