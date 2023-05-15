// module necessaire
const DB=require("../db.config")
const { DataTypes }= require("sequelize")
//  import de express 
const express =require("express")

let Emprunt= require("../models/emprunts")

let   { Livre } = require('../models/livres')
let  Emprunteur =require('../models/emprunteurs')
Emprunt= DB.Emprunt
Emprunteur= DB.Emprunteur
Livre=DB.Livre

let router =express.Router()

router.get('',async(req,res)=>{
    try{
        let emprunts= await Emprunt.findAll({include: [
            {
            model: Emprunteur,
              attributes: ['nom', 'prenom', 'email', 'telephone']
            },{
                model:Livre,
                attributes:['titre','ISBN']
            }
          ]
        })
        return res.json({ data:emprunts})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'database error',err:err})
    }

})

router.get('/:id',async(req,res)=>{
    try{
        let id =parseInt(req.params.id)

        let emprunt = await Emprunt.findOne({ where:{ id_Emprunt:id},include: [
            {
            model: Emprunteur,
              attributes: ['nom', 'prenom', 'email', 'telephone']
            },{
                model:Livre,
                attributes:['titre','ISBN']
            }
          ]
        })
        if(!emprunt){
            return res.status(400).json({ message:'emprunt doesnt exist '})
        }
        return res.status(200).json({ message:`voici l'emprunt `,data:emprunt})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message:'database error'})
    }

})

router.post('',async(req,res)=>{
    try{
        const { nom, prenom, email, telephone, livre_id} =req.body
        console.log(livre_id)
        console.log(req.body)
        let livre = await Livre.findOne({ where: {id_Livre: livre_id },row:true})
        if(!livre){
            res.status(400).json({message:'book or livre noot found '})
        }
        let emprunteur =await Emprunteur.findOne({where: {email:email} })
        console.log(emprunteur)
        if(!emprunteur){
            await Emprunteur.create({
                nom:nom,
                prenom:prenom,
                email:email,
                telephone:telephone
            })
        }
        
        console.log(`id emprunteur la se ${emprunteur.id_Emprunteur}`)
        const newEmprunt = await Emprunt.create({
                date_emprunt:new Date(),
                date_retour_reel:null,
                emprunteur_id:emprunteur.id_Emprunteur,
                livre_id:livre_id
            })
        return res.json({message:'new emprunt add',data:newEmprunt, emprunteur:emprunteur})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: err.message})
    }
})

// update date de retour reel 
router.put('/:id',async(req,res)=>{
    try{
        const { date_emprunt, date_retour_reel, date_retour_prevu }= req.body

        const id_emprunt= parseInt(req.params.id)
        const emprunt= await Emprunt.findByPk(id_emprunt)
        console.log(emprunt)
        if(emprunt){
            let updateEmprunt = await Emprunt.update({
                date_emprunt:date_emprunt,
                date_retour_reel:date_retour_reel,
                date_retour_prevu:date_retour_prevu
            },{ where: {id_Emprunt:id_emprunt} })
            res.status(200).json({message:'emprunt was update',data:updateEmprunt})
        }else{
            res.status(400).json({message:'l\'emprunt doesn\'t not exist '})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({message: err.message})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const id_emprunt= parseInt(req.params.id)
         if(!id_emprunt){
            return res.status(400).json({message:'missing parameter '})
        }
        await Emprunt.destroy({where : {id_Emprunt:id_emprunt},force:true})
        return res.status(204).json({})
    }catch(err){
        return res.status(500).json({message:'error database '})
    }
    

})

router.delete('/trash/:id',async(req,res)=>{
    try{
        const id_emprunt= parseInt(req.params.id)
         if(!id_emprunt){
            return res.status(400).json({message:'missing parameter '})
        }
        await Emprunt.destroy({where : {id_Emprunt:id_emprunt}})
        return res.status(204).json({})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database'})
    }
})


router.post('/untrash/:id',async(req,res)=>{
    try{
        let id_emprunt= parseInt(req.params.id)
        if(!id_emprunt){
            return res.status(400).json({message:'missing parameter '})
        }
        await Emprunt.restore({where: {id_Emprunt:id_emprunt}})
        return res.status(204).json({})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database'})
    }
})
module.exports= router