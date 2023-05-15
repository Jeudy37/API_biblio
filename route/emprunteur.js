const express =require("express")

const DB= require('../db.config')

let  Emprunteur=require('../models/emprunteurs')

Emprunteur= DB.Emprunteur
let router =express.Router()

router.use( (req,res,next)=>{
    const event =new Date()
    console.log('emprunteur time ',event.toString())
    next()
})

router.get('',async(req,res)=>{
    try{
        let auteurs = await Emprunteur.findAll()
        return res.json({ data:auteurs})
    }catch{
        return res.status(500).json({message: 'Database error li ye'})
    }

})

router.get('/:id',async(req,res)=>{
    try{

        let emprunteurId=parseInt(req.params.id)
        console.log('id emprunteur a ',emprunteurId)
        if(!emprunteurId){
            return res.status(400).json({ message:'Missing parameter '})
        }
        let emprunteur= await Emprunteur.findOne({ where: {id_Emprunteur: emprunteurId },row:true})
        if(emprunteur ===null){
            return res.status(400).json({ message:'This author is not exist'})
        }
        return res.json({ data:emprunteur})
    }catch{
        return res.status(500).json('Database error kaka')
    }
})

router.post('',async(req,res)=>{

    try{

        const { nom ,prenom,email,telephone }= req.body
        if(!nom  ||!telephone || !prenom || !email){
            return res.status(400).json({message:'missing parameter'})
        }
        let emprunteur = await Emprunteur.findOne({ where: { email:email},row:true})
        if(emprunteur !=null){
            return res.status(400).json({ message:`The author with  email ${email} already exist `})
        }
        
        emprunteur = await Emprunteur.create(req.body)
        return res.status(200).json({message: 'autheur create whit success',data:emprunteur})
    }catch(err){
        return res.status(500).json({message:'Database error',err})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        let emprunteurId= parseInt(req.params.id)

        if(!emprunteurId){
            return res.status(400).json( { message:'missing parameter'})
        }
        await Emprunteur.destroy({ where: {id_Emprunteur:emprunteurId},force:true})
        return res.status(204).json({})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Database error ',err})
    }
})

router.delete('/trash/:id',async(req,res)=>{
    try{
        let emprunteurId=parseInt(req.params.id)
        if(!emprunteurId){
            return res.status(400).json({ message:',missing parameter '})

        }
        await Emprunteur.destroy({ where: {id_Emprunteur:emprunteurId}})
        return res.status(204).json({ })
    }catch(err){
        return res.status(500).json({ message:'database error',err})
    }
})

router.post('/untrash/:id',async(req,res)=>{
    try{
        let emprunteurId =parseInt(req.params.id)

        if(!emprunteurId){
            return res.status(400).json({ message: 'missing parameter '})
        }
        await Emprunteur.restore({ where: {id_Emprunteur:emprunteurId }})
        return res.status(204).json({ })
    }catch(err){
        return res.status(500).json({ message:'database error ',err})
    }
})

router.patch('/:id',async(req,res)=>{
    try{
        let emprunteurId= parseInt(req.params.id)
        if(!emprunteurId){
            return res.status(400).json({ message:'missing parameter'})
        }
        let emprunteur =await Emprunteur.update(req.body,{ where: {id_Emprunteur:emprunteurId}})
        return res.status(200).json({ message:'author update',data:emprunteur})
    }catch(err){
        return res.status(500).json({message:'database error ',err})
    }
    
})

module.exports= router
