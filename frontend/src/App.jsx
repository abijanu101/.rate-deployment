import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'

import Navbar from './components/navbar/navbar.jsx'
import Home from './components/essentials/home.jsx'
import Login from './components/essentials/login.jsx'
import Signup from './components/essentials/signup.jsx'
import NotFound from './components/essentials/notfound.jsx'

import Movies from './components/core/movies.jsx'
import Movie from './components/core/movie.jsx'
import AddMovie from './components/core/addmovie.jsx'
import EditMovie from './components/core/editmovie.jsx'

import People from './components/core/people.jsx'
import Person from './components/core/person.jsx'
import AddPerson from './components/core/addperson.jsx'
import EditPerson from './components/core/editperson.jsx'
import Genre from './components/core/genre.jsx'


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/m/" element={<Movies />} />
          <Route path="/m/:movieID/" element={<Movie />} />
          <Route path="/m/create/" element={<AddMovie/>} />
          <Route path="/m/edit/:movieID/" element={<EditMovie/>}/>

          <Route path="/p/" element={<People />} />
          <Route path="/p/:personID/" element={<Person />} />
          <Route path="/p/create/" element={<AddPerson/>}/>
          <Route path="/p/edit/:personID" element={<EditPerson/>}/>

          <Route path="/g/:genreID" element={<Genre />} />

          <Route path="/login/" element={<Login />} />
          <Route path="/signup/" element={<Signup />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
