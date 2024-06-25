const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Verbinden mit MongoDB-Datenbank
mongoose.connect('mongodb://localhost:27017/recipe-library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB verbunden'))
.catch(err => console.error('MongoDB Verbindungsfehler:', err));

// Schema und Modell definieren
const RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  time: Number,
  difficulty: String,
  instructions: String,
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

// Routen definieren
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Laden der Rezepte' });
  }
});

app.post('/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Hinzufügen des Rezepts' });
  }
});

app.put('/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Rezepts' });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rezept gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Rezepts' });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});