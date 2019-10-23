const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

dotenv.config();

const app = express();

mongoose.connect(process.env.URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!')
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas')
    console.error(error);
  })
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



// adds a new recipe to the database
app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    time: req.body.time,
    difficulty: req.body.difficulty,
  });
  recipe.save()
    .then(() => {
      res.status(201).json({
        recipe,
        message: 'Post saved sucessfully'
      });
    })
    .catch((error) => {
      res.status(400).json({
        errors: error.message
      });
    })
});

// returns all recipes in database
app.get('/api/recipes', (req, res, next) => {
  console.log("req", req.url);
  Recipe.find().then((recipes) => {
      res.status(200).json(
        recipes
      )
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message
      });
    });
});

// modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
    time: req.body.time,
    difficulty: req.body.difficulty,
  });
  Recipe.updateOne({
    _id: req.params.id
  }, recipe).then(() => {
    res.status(201).json({
      recipe,
      message: 'Recipe updated successfully'
    });
  }).catch((error) => {
    res.status(400).json({
      error: error
    });
  })
});

// deletes the recipe with the provided ID
app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({
    _id: req.params.id
  }).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});


//  returns the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findOne({
      _id: req.params.id
    }).then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((error) => {
      res.status(404).json({
        error: error
      });
    })
})


module.exports = app;