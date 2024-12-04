import React,{useState,useEffect} from 'react'
import Chat from'./Chat'
import NavBar from './NavBar'
import './App.css'


function App() {
    const [activeIndex, setActiveIndex] = useState('documents')
    const [chats, setChats] = useState([]);
    const fetchChats =()=>{
        const storedChats = JSON.parse(localStorage.getItem('chats')) || [];
        setChats(storedChats);
    }
    useEffect(() => {
        fetchChats();
        
    }, []);

  return (
    <div className="app">
        <NavBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} fetchChats={fetchChats} />
        <Chat activeIndex ={activeIndex}  chats={chats} setChats={setChats}/>

    </div>
        
  )
}

export default App