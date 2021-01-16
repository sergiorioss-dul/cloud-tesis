const Usuarios = require('../models/Usuarios');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const { cloudinary } = require('../utils/cloudinary');

exports.borrarUsuario = async(req,res,next) =>{
    const usuario = await Usuarios.findOne({where:{id:req.params.id}});
    if(!usuario){
        res.json('No Encontrado!');
        return next();
    }
    eliminarImagenCliente(usuario.imagen);
    await Usuarios.destroy({
        where : {
            id: req.params.id
        }
    });
}
exports.test = async(req,res) =>{
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr,{
            upload_preset: 'devs'
        });
        const usuario = await Usuarios.create({ nombre: req.body.nombre, imagen: uploadedResponse.url });
        await usuario.save();
        res.status(200).json({msg:'Añadido'});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Baf'})
    }
}
exports.nuevoUsuario = async(req,res,next) =>{
    const usuario = new Usuarios(req.body);
    if(req.file){
        usuario.imagen = req.file.filename;
    }
    try {
        await usuario.save();
        res.json({mensaje:'Nuevo Cliente'})
    } catch (error) {
        console.log(error);
        next();
    }
}

exports.mostrarUsuarios = async(req,res,next) =>{
   try {
      const usuarios = await Usuarios.findAll({});
      res.json(usuarios);
   } catch (error) {
       console.log(error);
       next();
   }
}

exports.subirImagen = async(req,res,next) =>{
    upload(req,res,function(error){
        if(error){
            console.log(error);
        }else{
            next();
        }
    })
}


const configuracionMulter = {
    limits: { filesize: 300000}, //tamaño de 3MG
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,next) =>{
            next(null, __dirname + "../../uploads/");
        },
        filename: (req,file,next) => {
            const extension = file.mimetype.split('/')[1];
            next(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,next){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            next(null,true);
        }else{
            next(new Error('Formato no válido'),false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

exports.eliminarImagenCliente = async(req,res) => {
    const usuario = await Usuarios.findOne({where:{id:req.params.id}});
    if(!usuario){
        res.json('No Encontrado!');
        return next();
    }
    let exp_reg = /[/]+[A-Za-z0-9]*.(jpg)$/g;
    let respuesta = usuario.imagen.match(exp_reg)
    const id_cloudinary = respuesta[0].substring(1,respuesta[0].length-4);
    const cloudinary_id = `dev_setups/${id_cloudinary}`;
    await cloudinary.uploader.destroy(cloudinary_id)
        .then( respuesta => {
            console.log(respuesta);
            res.status(200).json({msg:'Exito'})
        }).catch(err =>{
            console.log(err);
    });
    await Usuarios.destroy({
        where : {
            id: req.params.id
        }
    });
}