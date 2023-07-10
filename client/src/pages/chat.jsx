import React, { useEffect, useState, useRef } from 'react';
import { styled } from 'styled-components';
import { getAllUsers } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Contacts from '../components/contacts';
import Welcome from '../components/welcome';
import ChatContainer from '../components/chatContainer';
import { io } from 'socket.io-client';
import { host } from '../utils/api';


const Chat = () => {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    
    const navigate = useNavigate();

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };


    const getAllContacts = async () => {
        // console.log('getTheContacts');
        const response = await axios({
            method: 'get',
            url: getAllUsers
        });
        setContacts(response.data.users);
    }

   

    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        }
        else {
            const user = JSON.parse(localStorage.getItem('chat-app-user'));
            if(!user.isVerified){
                navigate('/verify');
            }
            // console.log(user);
            //this thing creates a connection between client and server
            socket.current = io(host); //storing in a ref so it persists across renders
            // console.log(socket.current);
            socket.current.emit('add-user', user._id);
            getAllContacts();
        }
    }, []);

    //socket connection
    return (
        <Container>
            <div className="container">
                <Contacts contacts={contacts} changeChat={handleChatChange} />

                {
                    currentChat === undefined ? (
                        <Welcome />
                    )
                        :
                        <ChatContainer currentChat={currentChat} socket={socket}/>
                }
            </div>
        </Container>

    )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 90vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 30% 70%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;



export default Chat;