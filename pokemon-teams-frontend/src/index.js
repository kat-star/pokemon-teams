const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

//immediately invoked function expression, used to prevent functions hanging out unnecessarily in the global scope. JS convention This prevents accessing variables within the IIFE idiom as well as polluting the global scope.

(function() {
  fetchTrainers();
  listenForAddPokemon();
  listenForReleasePokemon();
})();

function trainerContainer() {
  return document.querySelector('main');
}
 
function renderTrainerCard(trainer) {
  return `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
      ${ trainer.pokemons.map(pokemon => renderPokemon(pokemon)).join('')}
    </ul>
  </div>`;
}

function renderPokemon(pokemon) {
  return `
    <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
  `;
}

function fetchTrainers() {
  return fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(trainers => {
      // allTrainers = trainers
      trainerContainer().innerHTML = trainers.map(t => {
        return renderTrainerCard(t)
      }).join('');
      // trainers.map(t => {
      //   const trainerContainer = document.querySelector(`[data-id="${t.id}"]`)
      //   const pokemonsContainer = trainerContainer.querySelector('ul')
      //   pokemonsContainer.innerHTML = t.pokemons.map(pokemon => {
      //     return renderPokemon(pokemon)
      //   }).join('');
      // })
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
      fetch(`${POKEMONS_URL}/${pokemonId}`, {
        method: 'DELETE'
      }).then(resp => resp.json())
        .then(event.target.parentElement.remove())
    }
  })
}
