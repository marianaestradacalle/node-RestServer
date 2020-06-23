const jwt = require('jsonwebtoken');

// 
// verificar token
// 

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mesaage: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

// verificar admin_rol
let verificaRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                mesaage: 'El usuario no es administrador'
            }
        });
    }
};

// Verificar el token para una imagen
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mesaage: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenImg
};