import { useEffect, useState } from 'react';
import Pokemon from './Components/Pokemon';
import Axios from 'axios';
import axios from 'axios';

const url = 'https://pokeapi.co/api/v2'



function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon/');
  const [pokemonName, setPokemonName] = useState('');
  const [selectElement, setSelectElement] = useState([]);
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [pokemon, setPokemon] = useState ({
    id: "",
    name: "",
    img: "",
    types: ""
  });
 


  const getAllPokemons = async () => { //función que sirve para obtener en un json los datos de la pokeapi
    const res = await fetch(loadMore)   //Se golpe la api declarada en la constante loadMore para obtener los datos como un array
    const data = await res.json()
 
    console.log(data);

    setLoadMore(data.next) //Al obtener un objeto se setea para que LoadMore traiga los próximos 20 pokemons
    
    function createPokemonObject (result) {
      result.forEach( async (pokemon) => {
       const res = await fetch (`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)         
       const data = await res.json()

       setAllPokemons(currentList => [...currentList, data]) //Hace la funcionalidad de push
                                                             //setAllPokemons.push(data)

      })

    } 
    createPokemonObject(data.results)
  }


  const searchPokemon = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) =>{
      setPokemon({
        name: pokemonName,
        img: response.data.sprites.other.dream_world.front_default,
        type: response.data.types[0].type.name
        });
        setPokemonChosen(true);
    })
     
  }

  const getSelectElement = async () => {
    await axios.get(`${url}/type/`)
    .then(response  => {
      setSelectElement(response.data.results)
    })
     .catch((err) =>{
      console.log(err);
     })
    
  }
  
  useEffect (() => {
    getAllPokemons()
    getSelectElement()
  }, [])


    
  return (
    <div className="app-container">
      <h1>Pokedex</h1>
      <div className="search-container">
      <input 
      className='searchbar'
      type="text"
      placeholder='Buscar Pokemon...'
        onChange={(e) => {
          setPokemonName(e.target.value)
        }}
      />
      <br/>
      <select className='optionbar'>
        <option value='default'
        onChange={(e) => {
          setSelectElement(e.target.value)
        }}>Default</option>
        {
          selectElement.map((element, idx) => (
          <option key={idx} value={element.url}>{element.name}</option>
          ))
        }
      </select>
      <br/>
      <button onClick={searchPokemon} className="bttn-search">Catch them all!</button>
    </div>
    <div className='display-section'>
        {!pokemonChosen ? (
          <h6>Elegir otro, no existe</h6>
          ): (
            <div className='thumb-container'>
            <div className='number'>
            <small>{pokemon.id}</small>
            </div>
          <img src={pokemon.img} alt={pokemon.name} />
          <h3>{pokemon.name}</h3>
          <small>type: {pokemon.type}</small>
          </div>
          )}
      </div>
      <div className="pokemon-container">
        <div className="all-container">
        {allPokemons.map ((pokemon, index) => 
        <Pokemon 
          id = {pokemon.id}
          name = {pokemon.name}
          image = {pokemon.sprites.other.dream_world.front_default}
          type = {pokemon.types[0].type.name}
          key = {index}
        />)}
      </div>
     <button className="load-more" onClick={() => getAllPokemons ()}>Load more</button> 
      </div>
    </div>
  );
}

export default App;
