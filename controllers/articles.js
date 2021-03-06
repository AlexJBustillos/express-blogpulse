let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
//commented out portion is using .then, writing async on (req, res) allows you to use await!!
router.get('/:id', async (req, res) => { 
  // using .then
  
  // db.article.findOne({      
  //   where: { id: req.params.id },      
  //   include: [db.author, db.comment] })  
  // .then((article) => {  
  //   if (!article) throw Error()
  //     console.log(article)  
  //   // article.getComments().then(comments =>  { 
  //     // console.log(comments);   
  //     res.render('articles/show', { article: article })
  // }) 
  // .catch((error) => {
  //   console.log(error)
  //   res.status(400).render('main/404')
  // }) 
  const article = await db.article.findOne({
    where: { id: req.params.id },      
    include: [db.author, db.comment] 
  })
  if (!article) throw Error()
  res.render('articles/show', { article: article })
});

router.post('/:id/comments', (req, res) => {
  db.comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.articleId
  }).catch(error => {
    res.status(400).render('main/404');
  })
})
  

module.exports = router
