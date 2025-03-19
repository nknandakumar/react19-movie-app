import {useState,useEffect} from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import MovieCard from './components/MovieCard'
import { updateSearchTerm } from './appwrite'
const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
    method:'GET',
    headers:{
        accept:'application/json',
        Authorization:`Bearer ${API_KEY}`
    }
}

//API_KEY= "9056bffdb0dc8e934013a42a7cdb14b2"

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)
    const [movieList, setMovieList] = useState([])
    const [isLoadin, setIsLoadin] = useState(false)
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

    useDebounce(()=> setDebounceSearchTerm(searchTerm),500,[searchTerm])

    const fetchMovies =async (query = '')=>{
        setIsLoadin(true)
     try {
        const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
           const response =  await fetch(endpoint,API_OPTIONS)
           const data = await response.json()
           if(!response.ok){
             throw new Error("Error in fetching")
           }
           if (data.response === false) {
            setErrorMsg(data.Error || 'Failed to fetch movies')
            setMovieList([])
            return;
           }
             setMovieList(data.results || [])
           console.log(data.results || [])
           updateSearchTerm()
     } catch (error) {
        console.error(`Error in fetching movies : ${error}`)
        setErrorMsg("Error in fetching movies, please try again")
     }finally{
        setIsLoadin(false)
     }
    } 

    useEffect(()=>{
       fetchMovies(debounceSearchTerm)
    },[debounceSearchTerm])

  return (
    <main>
        <div className='pattern' />
        <div className="wrapper  ">
            <header>
                <img src="./hero.png" alt="hero banner" />
                <h1>    Find  <span className='text-gradient' >Movies</span> You’ll Love Without the Hassle</h1>
                 <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>
            <section className="all-movies">
                <h1 className="mt-[40px]">All Movies</h1>
                {isLoadin ? ( <p className='text-white' >Loading...</p>): errorMsg ?(
                    <p className='text-red-500' >{errorMsg}</p>
                ):(
                    <ul>
                        {
                            movieList.map((movie)=>(
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        }
                    </ul>
                )}
             
            </section>
        </div>
    </main>
  )
}

export default App