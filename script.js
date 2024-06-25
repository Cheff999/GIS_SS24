document.addEventListener('DOMContentLoaded', () => {
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

    const apiUrl = 'http://localhost:5000/recipes';

    // Rezepte aus dem Backend laden und anzeigen
    const loadRecipes = async () => {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const recipes = await response.json();
                renderRecipes(recipes);
            } else {
                console.error('Fehler beim Laden der Rezepte:', response.statusText);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Rezepte:', error);
        }
    };

    const renderRecipes = (recipes) => {
        container.innerHTML = '';
        recipes.forEach((recipe) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <h2>${recipe.title}</h2>
                <p>Zutaten: ${recipe.ingredients}</p>
                <p>Kochzeit: ${recipe.time} Minuten</p>
                <p>Schwierigkeitsgrad: ${recipe.difficulty}</p>
                <p>Anleitung: ${recipe.instructions}</p>
                <button onclick="editRecipe('${recipe._id}')">Bearbeiten</button>
                <button onclick="deleteRecipe('${recipe._id}')">Löschen</button>
            `;
            container.appendChild(recipeDiv);
        });
    };

    loadRecipes();

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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newRecipe = {
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value,
            time: document.getElementById('time').value,
            difficulty: document.getElementById('difficulty').value,
            instructions: document.getElementById('instructions').value,
        };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecipe)
            });
            if (response.ok) {
                const createdRecipe = await response.json();
                loadRecipes();
                form.reset();
            } else {
                console.error('Fehler beim Hinzufügen des Rezepts:', response.statusText);
            }
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Rezepts:', error);
        }
    });
});

async function editRecipe(id) {
    const response = await fetch(`http://localhost:5000/recipes/${id}`);
    const recipe = await response.json();
    const title = prompt("Titel:", recipe.title);
    const ingredients = prompt("Zutaten:", recipe.ingredients);
    const time = prompt("Kochzeit (Minuten):", recipe.time);
    const difficulty = prompt("Schwierigkeitsgrad:", recipe.difficulty);
    const instructions = prompt("Anleitung:", recipe.instructions);
    if (title && ingredients && time && difficulty && instructions) {
        const updatedRecipe = {
            title,
            ingredients,
            time,
            difficulty,
            instructions
        };
        await fetch(`http://localhost:5000/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRecipe)
        });
        location.reload();
    }
}

async function deleteRecipe(id) {
    await fetch(`http://localhost:5000/recipes/${id}`, {
        method: 'DELETE'
    });
    location.reload();
}