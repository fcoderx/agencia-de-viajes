const express = require('express');
const router = express.Router();

// Importar modelo
const Viaje = require('../models/viajes');
const Testimonial = require('../models/Testimoniales');

router.get('/', (req, res) => {
    const promises = [];

    promises.push( Viaje.findAll({
        limit: 3
    }));

    promises.push( Testimonial.findAll({
        limit: 3
    })); 

    const resultado = Promise.all(promises);
   
    resultado.then( resultado => res.render('index', {
        pagina: 'Próximos viajes',
        clase: 'home',
        viajes: resultado[0],
        testimoniales: resultado[1]
    }))
    .catch(err => console.error(err));
});

router.get('/nosotros', (req, res) => {
    res.render('nosotros', {
        pagina: 'Sobre nosotros'
    });
});

router.get('/viajes', (req, res) => {
    Viaje.findAll()
    .then( viajes => res.render('viajes', {
        pagina: 'Próximos viajes',
        viajes
    }))
    .catch(err => console.error(err));
});

router.get('/viajes/:id', (req, res) => {
    let id = req.params.id;
    Viaje.findByPk(id)
    .then(viaje => res.render('viaje', {
        viaje
    }))
    .catch(err => console.error(err));
});

router.get('/testimoniales', (req, res) => {
    Testimonial.findAll()
    .then(testimoniales => res.render('testimoniales', {
        pagina: 'Testimoniales',
        testimoniales
    }))
    .catch(err => console.error(err));
});

router.post('/testimoniales', (req, res) => {
    // Validar que los campos no esten vacios
    let {nombre, correo, mensaje} = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({mensaje: 'Agrega tu nombre'});
    }

    if (!correo) {
        errores.push({'mensaje': 'Agrega tu correo'});
    }

    if (!mensaje) {
        errores.push({mensaje: 'Agrega tu mensaje'});
    }

    // Revisar si hay errores
    if (errores.length > 0) {
        // Muestra la vista con errores
        Testimonial.findAll()
        .then(testimoniales => res.render('testimoniales', {
            errores,
            nombre,
            correo,
            mensaje,
            pagina: 'Testimoniales',
            testimoniales
        }));
        
    } else {
        // Almacenarlos en la BD
        Testimonial.create({
            nombre,
            correo,
            mensaje
        })
        .then(testimonial => res.redirect('/testimoniales'))
        .catch(err => console.error(err));
    }
});


module.exports = router;