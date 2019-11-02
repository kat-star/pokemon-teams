const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

fetchTrainers()
listenForAddPokemon()
listenForReleasePokemon()
// let allTrainers;

function trainerContainer() {
  return document.querySelector('main');
}
 
function renderTrainerCard(trainer) {
  return `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
    </ul>
  </div>`;
}

function renderPokemon(pokemon) {
  return `
    <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
  `;
}

function fetchTrainers() {
  return fetch('http://localhost:3000/trainers')
    .then(resp => resp.json())
    .then(trainers => {
      // allTrainers = trainers
      trainerContainer().innerHTML = trainers.map(t => {
        return renderTrainerCard(t)
      }).join(''); //mapping over all trainers to their trainer card
      trainers.map(t => {
        const trainerContainer = document.querySelector(`[data-id="${t.id}"]`)
        const pokemonsContainer = trainerContainer.querySelector('ul')
        pokemonsContainer.innerHTML = t.pokemons.map(pokemon => {
          return renderPokemon(pokemon)
        }).join('');
      })
    })
}

function listenForAddPokemon() {
  trainerContainer().addEventListener('click', function(event) {
    const pokemonsContainer = event.target.parentElement
    const trainerId = (event.target.dataset.trainerId)
    const pokemonUl = pokemonsContainer.querySelector('ul')
    const pokemonList = pokemonsContainer.querySelectorAll('li')
    
    if (event.target.textContent == 'Add Pokemon' && pokemonList.length < 6) {
      fetch(POKEMONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "trainer_id": trainerId
        })
      }).then(resp => resp.json())
        .then(pokemon => {pokemonUl.innerHTML += renderPokemon(pokemon)})
    }
  })
}

function listenForReleasePokemon() {
  trainerContainer().addEventListener('click', function(event) {
    const pokemonId = parseInt(event.target.dataset.pokemonId)

    if (event.target.textContent == 'Release') {
      fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
        method: 'DELETE'
      }).then(resp => resp.json())
        .then(event.target.parentElement.remove())
    }
  })
}
