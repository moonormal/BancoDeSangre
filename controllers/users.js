const express =require('express');
const bcript =  require('bcrypt');
const async = require('async');
const User = require('../models/user');

function list(req, res, next) {
  User.find().then(objs => res.status(200).json({
    message: 'Lista de usuarios del sistema',
    obj:objs
  })).catch(ex => res.status(500).json({
    message: 'No se pudo consultar la información de los usuarios',
    obj: ex
  }));
}

function index(req,res,next){
  const id = req.params.id;
  User.findOne({"_id":id}).then(obj => res.status(200).json({
    message: `Usuario almacenado con ID ${id}`,
    obj: obj
  })).catch(ex => res.status(500).json({
    message: `No se pudo consultar la información del usuario con ID ${id}`,
    obj: ex
  }));
}

function create(req,res,next){
    let correo = req.body.correo;
    let password = req.body.password;
    let tipoUsuario = req.body.tipoUsuario;

    async.parallel({
      salt:(callback) =>{
        bcript.genSalt(10, callback);
      }
    }, (err, result) =>{
      bcript.hash(password, result.salt,(err, hash)=>{
        let user = new User({
          correo:correo,
          password:hash,
          tipoUsuario:tipoUsuario,
          salt:result.salt
        });
    
        user.save().then(obj => res.status(200).json({
          message: 'Usuario creado correctamente',
          obj: obj
        })).catch(ex => res.status(500).json({
          message: 'No se pudo almacenar el usuario.',
          obj: ex
        }));
      })
    })
}

function replace(req,res,next){
  const id = req.params.id ? req.params.id: "" ;
  let correo = req.body.correo ? req.body.correo:"";
  let password = req.body.password ? req.body.password:"";
  let tipoUsuario = req.body.tipoUsuario ? req.body.tipoUsuario: "";

  let user = new Object({
    _correo: correo,
    _password: password,
    _tipoUsuario: tipoUsuario
  });

  User.findOneAndUpdate({"_id":id}, user).then(obj => res.status(200).json({
    message:"Usuario reemplazado correctamente",
    obj:obj
  })).catch(ex => res.status(500).json({
    message: 'No se pudo remplazar el usuario',
    obj: ex
  }));

}

function edit(req,res,next){
  const id = req.params.id;
  let correo = req.body.correo;
  let password = req.body.password;
  let tipoUsuario = req.body.tipoUsuario;

  let user = new Object();

  if(correo){
    user._correo = correo;
  }

  if(password){
    user._password = password;
  }

  if(tipoUsuario){
    user._tipoUsuario = tipoUsuario;
  }

  User.findOneAndUpdate({"_id":id}, user).then(obj => res.status(200).json({
    message:"Usuario actualizado correctamente",
    obj:obj
  })).catch(ex => res.status(500).json({
    message: 'No se pudo actualizar el usuario',
    obj: ex
  }));

}

function destroy(req,res,next){
  const id = req.params.id;
  User.remove({"_id":id}).then(obj => res.status(200).json({
    message:"Usuario eliminado correctamente",
    obj:obj
  })).catch(ex => res.status(500).json({
    message: 'No se pudo eliminar el usuario',
    obj: ex
  }));
}

module.exports ={
    list, index,create,edit,replace,destroy
}
