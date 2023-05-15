// module nesesee

const { DataTypes } =require('sequelize')

module.exports =(sequelize)=>{
    return Domaine =sequelize.define('Domaine',{
        id_Dom:{
            
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        libelle:{
            type:DataTypes.STRING(200),
            allowNull:false,
            defaultValue:''
        }
    },{ paranoid:true})
}