//  module neseser 

const { DataTypes }=require('sequelize')
// const { sequelize } = require('../db.config')

module.exports=(sequelize)=>{
    return Emprunteur =sequelize.define('Emprunteur',{
        id_Emprunteur:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        nom:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false,
        },
        prenom:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false
        },
        email:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false
        },
        telephone:{
            type:DataTypes.STRING(15),
            defaultValue:'',
            allowNull:false
        },
    }, { paranoid: true})
}