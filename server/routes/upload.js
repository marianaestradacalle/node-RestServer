// Cargar imagenes al servidor

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: 'No se ha seleccionado ningún archivo'
            });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            err: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
        })
    };

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]

    // Validar extensiones permitidas de la imagen
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
        })
    }

    // Cambiar nombre de la imagen
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});

// Carga la imagen respectiva para un usuario
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');

            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');

            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'El usuario no existe'
                });
            }
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                Usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}

// Carga la imagen respectiva para un producto
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');

            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');

            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'El producto no existe'
                });
            }
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}

// Verifica si la imagen ya fue cargada, y si ya está cargada solo deja una
function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;