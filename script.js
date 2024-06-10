document.addEventListener('DOMContentLoaded', () => {
    // Elemente einfügen
    const app = document.getElementById('app');
    
    // Header einfügen
    const header = document.createElement('header');
    header.innerHTML = '<h1>Rezeptbibliothek</h1>';
    app.appendChild(header);
    
    // Navigation einfügen
    const nav = document.createElement('nav');
    nav.innerHTML = '<a href="#">Startseite</a> | <a href="#">Rezeptbibliothek</a> | <a href="#">Rezept hochladen</a>';
    app.appendChild(nav);
    
    // Container für die Rezepte
    const container = document.createElement('div');
    container.className = 'container';
    app.appendChild(container);
    
    // Rezepte aus localStorage laden und anzeigen
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    const renderRecipes = () => {
        container.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>Zutaten: ${recipe.ingredients}</p>
                <p>Kochzeit: ${recipe.time} Minuten</p>
                <p>Schwierigkeitsgrad: ${recipe.difficulty}</p>
                <p>Anleitung: ${recipe.instructions}</p>
                <button onclick="editRecipe(${index})">Bearbeiten</button>
                <button onclick="deleteRecipe(${index})">Löschen</button>
            `;
            container.appendChild(recipeDiv);
        });
    };
    
    renderRecipes();
    
    // Formular für neue Rezepte
    const form = document.createElement('form');
    form.innerHTML = `
        <h2>Neues Rezept hinzufügen</h2>
        <input type="text" id="title" placeholder="Titel" required>
        <textarea id="ingredients" placeholder="Zutaten" required></textarea>
        <input type="number" id="time" placeholder="Kochzeit (Minuten)" required>
        <input type="text" id="difficulty" placeholder="Schwierigkeitsgrad" required>
        <textarea id="instructions" placeholder="Anleitung" required></textarea>
        <button type="submit">Hinzufügen</button>
    `;
    app.appendChild(form);
    


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRecipe = {
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value,
            time: document.getElementById('time').value,
            difficulty: document.getElementById('difficulty').value,
            instructions: document.getElementById('instructions').value,
        };
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        renderRecipes();
        form.reset();
    });
});

function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes[index];
   document.getElementById('title').value=recipe.title
    const title = prompt("Titel:", recipe.title);
    const ingredients = prompt("Zutaten:", recipe.ingredients);
    const time = prompt("Kochzeit (Minuten):", recipe.time);
    const difficulty = prompt("Schwierigkeitsgrad:", recipe.difficulty);
    const instructions = prompt("Anleitung:", recipe.instructions);
    if (title && ingredients && time && difficulty && instructions) {
        recipes[index] = { title, ingredients, time, difficulty, instructions };
        localStorage.setItem('recipes', JSON.stringify(recipes));
        location.reload();
    }
}

function deleteRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    location.reload();
}