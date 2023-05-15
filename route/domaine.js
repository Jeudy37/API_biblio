const express= require('express')
const DB= require('../db.config')

let Domaine=require('../models/domaines')

Domaine= DB.Domaine

let router =express.Router()

router.use( (req,res,next)=>{
    const event =new Date()
    console.log('emprunteur time ',event.toString())
    next()
})

router.get('',async(req,res)=>{
    try{
        let domaines = await Domaine.findAll({})
        return res.json({domaines})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database '})
    }
})

router.get('/:id',async(req,res)=>{
    try{
        const id_domaine= parseInt(req.params.id)
        if(!id_domaine){
            return res.status(400).json({message:'missing parameter  '})
        }
        let domaine =await Domaine.findOne({where : {id_Dom:id_domaine} })
        if(domaine ==null){
            return res.status(400).json({message:'this domaine doesnt exist   '})
        }
        return res.status(200).json({message:`the dome is ${domaine.libelle}`,data:domaine})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database '})
    }
})

router.post('',async(req,res)=>{
    try{
        const { libelle } =req.body
        if(!libelle){
        return res.status(400).json({message:'missing parameter '})
        }
        let libell= await Domaine.findOne({ where: {libelle:libelle}})
        console.log(libell)
        if(libell !=null){
            return res.status(400).json({message:`this domaine with name ${libelle} is already exist `})
        }
        let domaine= await Domaine.create(req.body)

        return res.status(200).json({message:'domaine add with success',data:domaine})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database '})
    }
})

router.put('/:id',async(req,res)=>{
    try{

        const id_domaine= parseInt(req.params.id)
        if(!id_domaine){
            return res.status(400).json({message:'missing parameter '})
        }

        let updateDomaine= await Domaine.update(req.body,{ where: { id_Dom: id_domaine}})
        return res.status(200).json({message:'domaine update',data:updateDomaine})
    }catch(err){
        return res.status(500).json({message:'error database'})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const id_domaine= parseInt(req.params.id)
    if(!id_domaine){
        return res.status(400).json({message:'missing parameter'})
    }
    await Domaine.destroy({ where : {id_Dom: id_domaine},force:true})

    return res.status(204).json({})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database'})
    }
})

router.delete('/trash/:id',async(req,res)=>{
    try{
        const id_domaine= parseInt(req.params.id)
        if(!id_domaine){
            return res.status(400).json({message:'missing parameter'})
        }
        await Domaine.destroy({ where : {id_Dom: id_domaine}})
        return res.status(204).json({})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database '})
    }
})

router.post('/untrash/:id',async(req,res)=>{
    try{
        const id_domaine= parseInt(req.params.id)
        if(!id_domaine){
            return res.status(400).json({message:'missing parameter'})
        }
        let domaine = await Domaine.restore({ where : {id_Dom: id_domaine}})
        return res.status(200).json({message:'domaine was restored',data:domaine})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'error database '})
    }
})

module.exports= router