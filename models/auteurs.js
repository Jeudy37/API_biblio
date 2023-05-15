//  donnee necessaire 
const { DataTypes }= require('sequelize')
// const { sequelize } = require('../db.config')

module.exports=(sequelize)=>{
    return Auteur=sequelize.define('Auteur',{
        id_Auteur:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        nom:{
            type:DataTypes.STRING(150),
            defaultValue:'',
            allowNull:false
        },
        
        date_naissance:{
            type:DataTypes.DATE,
            allowNull:false
        },
        nationalite:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false
        }
    },{ paranoid:true })  //plan B poum restore
}
