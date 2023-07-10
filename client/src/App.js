import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Chat from './pages/chat';
import Login from './pages/login';
import SetAvatar from './pages/setAvatar';
import VerficationPage from './pages/VerficationPage';


const App = () => {
  return (
    <Routes>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/chat' element={<Chat/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/setAvatar' element={<SetAvatar/>}></Route>
      <Route path='/verify' element={<VerficationPage/>}/>
    </Routes>
  )
}

export default App
