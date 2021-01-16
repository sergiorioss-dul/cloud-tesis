const Sequelize = require('sequelize');
const db = require('../config/db');

const Usuarios = db.define('usuarios',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    nombre :  Sequelize.STRING(60),
    imagen: Sequelize.STRING(120),
},{
    timestamps: false
});

module.exports = Usuarios;
