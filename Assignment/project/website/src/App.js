import './App.css';
import React from 'react'
import Home from './components/home';
import Interview from './components/interview';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import CandidateList from './components/candidate_list';
import Upload from './components/upload';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    
      <Route path='upload/' element={<Upload/>}></Route>
      <Route path='' element={<Home />}></Route>
      <Route path='candidates/:year' element={<CandidateList />}></Route>
      <Route path="interview/:id" element={<Interview/>}></Route>
      <Route path="dashboard/:year" element={<Dashboard/>}></Route>
     </Routes>
    </BrowserRouter>
  );
}

export default App;