// module necessaire 

const { DataTypes }=require('sequelize')
// const { sequelize } = require('../db.config')

module.exports=(sequelize)=>{
    return Emprunt=sequelize.define('Emprunt',{
        id_Emprunt:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            // allowNull:false,
            autoIncrement:true
        },
        livre_id:{
            type:DataTypes.INTEGER(10),
            allowNull:false
        },
        emprunteur_id:{
            type:DataTypes.INTEGER(10),
            allowNull:false
        },
        date_emprunt:{
            type:DataTypes.DATE,
            // allowNull:false
        },
        date_retour_prevu:{
            type:DataTypes.DATE,
            // allowNull:false
        },date_retour_reel:{
            type:DataTypes.DATE,
        }
    },{ paranoid: true})
}