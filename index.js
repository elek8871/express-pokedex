const express = require('express');
const axios = require('axios'); 
const ejsLayouts = require('express-ejs-layouts');
const db = require('./models')

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

// GET / - main index of site
app.get('/', (req, res) => {
  let pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
  // Use request to call the API
  axios.get(pokemonUrl).then(apiResponse => {
    let pokemon = apiResponse.data.results;
    res.render('index', { pokemon: pokemon.slice(0, 151) });
  })
});
// GET /pokemon retrieve all favs
app.get ('/pokemon', async (req,res)=>{
  try{
    const allFaves= await db.pokemon.findAll()
    res.render ('faves.ejs', {
      allFaves
    })  
  } catch (err){
    console.log(err)
    res.send('server error')
  }

})

// POST /pokemon
app.post('/pokemon', async (req, res)=>{
  // res.send ('create a new fav')
  try{
    await db.pokemon.create(req.body)
    res.redirect('/pokemon')
  } catch(err){
   console.log(err)
   res.send ('pokemon error')
  }
})

// GET /pokemon/:name -> renders a show page w poke info

app.get('/pokemon/:name', async (req,res) => {
  try {
    // console.log(req.params.name)
    const url = `http://pokeapi.co/api/v2/pokemon/${req.params.name}/`
    axios.get(url)
      .then(response => {
      let pokemon = response.data.species;
      res.render('show.ejs', { pokemon })
      // console.log(response.data.species)
    })
  }catch(err){
    console.log(err)
    res.send('pokemon error')
  }
  // res.send('details about certain pokemon')
})

// Imports all routes from the pokemon routes file
app.use('/pokemon', require('./routes/pokemon'));

app.listen(port, () => {
  console.log('...listening on', port );
});