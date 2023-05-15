const express =require("express")

const DB= require('../db.config')

let  Auteur=require('../models/auteurs')

Auteur= DB.Auteur
let router =express.Router()

router.use( (req,res,next)=>{
    const event =new Date()
    console.log('auteur time ',event.toString())
    next()
})

router.get('',async(req,res)=>{
    try{
        let auteurs = await Auteur.findAll()
        return res.json({ data:auteurs})
    }catch{
        return res.status(500).json({message: 'Database error li ye'})
    }

})

router.get('/:id',async(req,res)=>{
    try{

        let auteurId=parseInt(req.params.id)
        console.log('id user a ',auteurId)
        if(!auteurId){
            return res.status(400).json({ message:'Missing parameter '})
        }
        let auteur= await Auteur.findOne({ where: {id_Auteur: auteurId },row:true})
        if(auteur ===null){
            return res.status(404).json({ message:'This author is not exist'})
        }
        return res.json({ data:auteur})
    }catch{
        return res.status(500).json('Database error kaka')
    }
})

router.put('',async(req,res)=>{

    try{

        const { nom,date_naissance,nationalite }= req.body
        if(!nom || !date_naissance ||!nationalite){
            return res.status(400).json({message:'missing parameter'})
        }
        let auteur = await Auteur.findOne({ where: { nom:nom},row:true})
        if(auteur !=null){
            return res.status(400).json({ message:`The author ${nom} already exist `})
        }
        
        auteur = await Auteur.create(req.body)
        console.log(auteur.id_Auteur)
        return res.status(200).json({message: 'autheur create whit success',data:auteur})
    }catch(err){
        return res.status(500).json({message:'Database error',err})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        let auteurId= parseInt(req.params.id)

        if(!auteurId){
            return res.status(400).json( { message:'missing parameter'})
        }
        await Auteur.destroy({ where: {id_Auteur:auteurId},force:true})
        return res.status(204).json({})
    }catch(err){
        return res.status(500).json({ message: 'Database error ',err})
    }
})

router.delete('/trash/:id',async(req,res)=>{
    try{
        let auteurId=parseInt(req.params.id)
        if(!auteurId){
            return res.status(400).json({ message:',missing parameter '})

        }
        await Auteur.destroy({ where: {id_Auteur:auteurId}})
        return res.status(204).json({ })
    }catch(err){
        return res.status(500).json({ message:'database error',err})
    }
})

router.post('/untrash/:id',async(req,res)=>{
    try{
        let auteurId =parseInt(req.params.id)

        if(!auteurId){
            return res.status(400).json({ message: 'missing parameter '})
        }
        await Auteur.restore({ where: {id_Auteur:auteurId }})
        return res.status(204).json({ })
    }catch(err){
        return res.status(500).json({ message:'database error ',err})
    }
})

router.patch('/:id',async(req,res)=>{
    try{
        let auteurId= parseInt(req.params.id)
        if(!auteurId){
            return res.status(400).json({ message:'missing parameter'})
        }
        let auteur =await Auteur.update(req.body,{ where: {id_Auteur:auteurId}})
        return res.status(200).json({ message:'author update',data:auteur})
    }catch(err){
        return res.status(500).json({message:'database error ',err})
    }
    
})

module.exports= router
