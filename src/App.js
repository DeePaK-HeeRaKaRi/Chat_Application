 
import './App.css';
import { Button } from '@chakra-ui/react'
import { Router, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
     
        <Route path="/" component={HomePage} exact></Route>
        <Route path="/chats" component={ChatPage} />
     
    </div>
  );
}

export default App;
