// module necessaire 
const { DataTypes }= require("sequelize")
// const { sequelize } = require("../db.config")

module.exports=(sequelize)=>{
    return Livre=sequelize.define('Livre',{
        id_Livre:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        titre:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false
        },
        langue_livre:{
            type:DataTypes.STRING(200),
            defaultValue:'',
            allowNull:false
        },
        ISBN:{
            type:DataTypes.STRING,
            allowNull:false
        },
        domaine_id:{
            type:DataTypes.INTEGER(10),
            allowNull:false
        },
        auteur_id:{
            type:DataTypes.INTEGER(10),
            allowNull:false
        },
        nbr_pages:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        image_livre:{
            type:DataTypes.STRING(500)
        }
    }, {paranoid:true})
}