// const { Pool } = require("pg")
const { Sequelize }= require("sequelize")
// connection to the DB

let sequelize =new Sequelize(
    "bibliotheque","jeudy",process.env.DB_PASSWORD,{
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        dialect:'postgres',
        logging:false,
    
    pool:{
        max:5, // nombre maximum de connexions dans le pool
        min:0 ,// nombre maximum de connexions dans le pool
        acquire:30000 ,// durée maximale, en millisecondes, pendant laquelle le pool essaiera d'obtenir une connexion avant de renvoyer une erreur
        idle:10000 // durée maximale, en millisecondes, pendant laquelle une connexion peut rester inactive dans le pool avant d'être libérée
    }
});
const db ={}
db.sequelize= sequelize

db.Auteur=require("./models/auteurs")(sequelize)
db.Domaine=require("./models/domaines.js")(sequelize)
db.Emprunt=require("./models/emprunts")(sequelize)
db.Livre=require("./models/livres")(sequelize)
db.Emprunteur=require("./models/emprunteurs")(sequelize)


db.sequelize.sync({alter:true})

db.Livre.hasMany(db.Emprunt,{foreignKey:'livre_id',onDelete:'cascade'})
db.Emprunt.belongsTo(db.Livre,{foreignKey:'livre_id'})

db.Emprunteur.hasMany(db.Emprunt,{foreignKey:'emprunteur_id'})
db.Emprunt.belongsTo(db.Emprunteur,{foreignKey:'emprunteur_id'})


db.Domaine.hasMany(db.Livre,{ foreignKey:'domaine_id'})
db.Livre.belongsTo(db.Domaine,{foreignKey:'domaine_id'})

db.Auteur.hasMany(db.Livre,{foreignKey:'auteur_id'})
db.Livre.belongsTo(db.Auteur,{foreignKey:'auteur_id'})
// db.Emprunt.belongsTo(db.Livre,{ foreignKey:'id_Livre'});
// db.Emprunt.belongsTo(db.Emprunteur,{ foreignKey:'id_Emprunteur'});
module.exports= db