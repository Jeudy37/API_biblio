const express=require("express")
const cors =require("cors")

const auteur_router=require("./route/auteur")
const emprunteur_router =require('./route/emprunteur')
const livre_router= require("./route/livre")
const emprunt_router=require('./route/emprunt')
const domaine_router= require('./route/domaine')
//importation de la connection du DB dans db.config
let DB=require('./db.config')


const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use('/auteurs',auteur_router)
app.use('/livres',livre_router)
app.use('/emprunteurs',emprunteur_router)
app.use('/emprunts',emprunt_router)
app.use('/domaines',domaine_router)

app.use( (error,req,res,next)=>{
    console.log('je suis dans le middleware')
    console.log(error)
    return res.status(error.statusCode || 500).json({ message:error})
})

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
//   });

app.get('/',(req,res)=>{
    res.send('je fais un api pour Bibliotheque et c serieux ')
})

app.get('*',(req,res)=>{
    res.status(404).send('c\'est quoi ce bordel' )
})


DB.sequelize.authenticate()
    .then( ()=>console.log("database is connect"))
    .then( ()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`the server is running on http://localhost:${process.env.PORT}`)
        })
    })
    .catch(err =>console.log("database error",err))

