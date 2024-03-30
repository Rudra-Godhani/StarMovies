/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import { fetchDataFromApi } from "./utils/api.js"
import { useSelector, useDispatch } from 'react-redux'
import { getApiconfiguration, getGenres } from "./store/homeSlice.js";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Home.jsx";
import Details from "./pages/details/Details"
import SearchResult from "./pages/searchResult/SearchResult.jsx";
import Explore from "./pages/explore/Explore.jsx";
import PageNotFound from "./pages/404/PageNotFound.jsx";
import Header from "./components/header/Header.jsx"
import Footer from "./components/footer/Footer.jsx"

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url);


  useEffect(() => {
    fetchApiConfing();
    genresCall();
  }, []);
  const fetchApiConfing = () => {
    fetchDataFromApi('/configuration')
      .then((res) => {

        const url = {
          backdrop: res.images.secure_base_url + "original",
          poster: res.images.secure_base_url + "original",
          profile: res.images.secure_base_url + "original",
        }

        dispatch(getApiconfiguration(url));

      });
  };

  const genresCall = async () => {
    let promises = [];
    let endpoints = ["tv", "movie"];
    let allGenres = {}
    endpoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    })

    const data = await Promise.all(promises);

    data.map(({ genres }) => {
      return genres.map((item) => {
        allGenres[item.id] = item
      })
    })
    
    dispatch(getGenres(allGenres));
    
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
