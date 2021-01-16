const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

module.exports = () => {
    router.post('/',usuarioController.test);
    /*router.post('/',usuarioController.subirImagen,
                    usuarioController.nuevoUsuario);*/
    router.get('/',usuarioController.mostrarUsuarios);
    router.delete('/:id',usuarioController.eliminarImagenCliente);
    return router;
}