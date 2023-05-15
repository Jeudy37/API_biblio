// module necessaire
// multer help to save image
const multer = require('multer')
const path =require('path')
const fs =require('fs')
const uploadDir = path.join(__dirname, '../uploads'); // Le dossier pour stocker les images

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads'); // folder to store uploaded images
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


// const storage= multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,uploadDir)
//   },
//   filename:(req,file,cb)=>{
//     cb(null,file.fieldname + '-' + Date.now())
//   }

// })
const upload = multer({ storage: storage })
const express = require('express')

const DB = require('../db.config')

let Livre = require('../models/livres')
// librairi isbn dans node
const isbn = require('isbn')

Livre = DB.Livre

function generateISBN() {
  let prefix = '978'
  let isbnBody = ''
  for (let i = 0; i < 9; i++) {
    isbnBody += Math.floor(Math.random() * 10)
  }
  let isbn = prefix + isbnBody
  let checksum = 0
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(isbn[i])
    checksum += i % 2 === 0 ? digit : digit * 3
  }
  checksum = (10 - (checksum % 10)) % 10
  return isbn + checksum
}

// console.log(generateISBN())

let router = express.Router()
//  const bookISBN = isbn.generate('978', '0', '00', '123456', '5')
router.use((req, res, next) => {
  const event = new Date()
  console.log('Livre time', event.toString())
  next()
})

router.get('', async (req, res) => {
    try {
      console.log('Fetching all books...')
      let livres = await Livre.findAll({
        include:[
          {
            model:Auteur,
            attributes:['nom','date_naissance','nationalite']
          },
          {
            model:Domaine,
            attributes:['libelle']
          }
        ],
      })
      console.log('Books fetched successfully.')
      return res.json({ data: livres })
    } catch (err) {
      console.log('Error fetching books:', err)
      return res.status(500).json({ message: 'error database', err })
    }
  })


router.get('/:id', async (req, res) => {
  try {
    const livreId = parseInt(req.params.id)
    // console.log('id an se',livreId)
    if (livreId) {
      let livre = await Livre.findOne({
        where: { id_Livre: livreId },
        include:[
          {
            model:Auteur,
            attributes:['nom','date_naissance','nationalite']
          },
          {
            model:Domaine,
            attributes:['libelle']
          }
        ],
      })
      return res
        .status(200)
        .json({ message: `le livre est`,data:livre })
    } 
  } catch (err) {
    return res.status(500).json({ message: 'database error ', err })
  }
})

router.post('', upload.single('image'), async (req, res) => {
  try {
    const { titre, langue_livre, nbr_pages ,auteur_id, domaine_id} = req.body

    if (!titre || !langue_livre || !nbr_pages || !auteur_id || !domaine_id ) {

      return res.status(400).json({ message: 'Missing parameter ' })
    }
    let livre = await Livre.findOne({ where: { titre: titre } })
    if (livre !== null) {

      return res.status(400).json({ message: `This book already exists` })
    }
    const book = {
      titre: titre,
      langue_livre: langue_livre,
      nbr_pages: nbr_pages,
      image_livre: req.file.path,
      ISBN: generateISBN(),
      auteur_id:auteur_id,
      domaine_id:domaine_id
    }
    await Livre.create(book)
      .then((theBook) => {
        console.log(theBook)

        return res
          .status(200)
          .json({ message: `Book created successfully`, leBook: theBook })
          
      })
      
      .catch((err) => {
        console.log(err)
        return res.status(500).json({ message: 'Error adding the book',err:err })
      })

  } catch (err) {
    console.log('Error: ', err)
    return res.status(500).json({ message: 'Database error', err: err })
  }
  // next()
})

router.patch('/:id', upload.any(''), async (req, res) => {
  try {
    const { titre, langue_livre, nbr_pages } = req.body;
    const { id } = req.params;

    if (!titre && !langue_livre && !nbr_pages && !req.files.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    let livre = await Livre.findOne({ where: { id_Livre: id } });

    if (livre === null) {
      return res.status(404).json({ message: `Book not found` });
    }
    if (titre) {
      livre.titre = titre;
    }
    if (langue_livre) {
      livre.langue_livre = langue_livre;
    }
    if (nbr_pages) {
      livre.nbr_pages = nbr_pages;
    }
    if (req.files.length > 0) {
      livre.image_livre = req.files[0].buffer.toString('base64');
    }
    await livre.save()
    return res.status(200).json({ message:'book update',data:livre})
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'database error ajou' })
  }
})



router.delete('/trash/:id', async (req, res) => {
  try {
    let livreId = parseInt(req.params.id)
    if (!livreId) {
      return res.status(400).json({ message: 'missing parameter' })
    }
    await Livre.destroy({ where: { id_Livre: livreId } })
    return res.status(204).json({})
  } catch (err) {
    return res.status(500).json({ message: 'error database', err })
  }
})
router.delete('/:id', async (req, res) => {
  try {
    let livreId = parseInt(req.params.id)
    if (!livreId) {
      return res.status(400).json({ message: 'missing parameter' })
    }
    await Livre.destroy({ where: { id_Livre: livreId }, force: true })
    return res.status(204).json({})
  } catch (err) {
    return res.status(500).json({ message: 'error database', err })
  }
})

router.post('/untrash/:id', async (req, res) => {
  try {
    let livreId = parseInt(req.params.id)
    if (!livreId) {
      return res.status(400).json({ message: 'missing parameter' })
    }
    let livre = await Livre.restore({ where: { id_Livre: livreId } })
    return res
      .status(204)
      .json({ message: 'book restore with success', data: livre })
  } catch (err) {
    return res.status(500).json({ message: 'error database', err })
  }
})

module.exports = router
