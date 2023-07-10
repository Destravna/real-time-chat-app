import React, { useEffect, useState, useRef } from 'react'
import { styled } from 'styled-components';
import ChatInput from './ChatInput';
import { sendMsgRoute } from '../utils/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getMsgs } from '../utils/api';


const ChatContainer = ({ currentChat, socket }) => {
	const scrollRef = useRef();
	const [messages, setMessages] = useState([]);
	const [arrivalMessage, setArrivalMessage] = useState(null);

	const getAllMessages = async () => {
		const user = JSON.parse(localStorage.getItem('chat-app-user'));
		// alert('getting all messages between ' + user.username + ' and ' + currentChat.username);
		try {
			const response = await axios({
				method: 'GET',
				url: getMsgs,
				params: {
					sender: user._id,
					receiver: currentChat._id
				}
			});
			const result = response.data;
			console.log(result.msgs);
			setMessages(result.msgs);
		}
		catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getAllMessages();
	}, [currentChat])


	const handleSendMsg = async (msg) => {
		const sender = await JSON.parse(localStorage.getItem('chat-app-user'));
		// console.log('send msg was called');
		const dataToBeSent = {
			sender: sender._id,
			receiver: currentChat._id,
			message: msg
		};

		try {
			const response = await axios({
				method: 'POST',
				url: sendMsgRoute,
				data: dataToBeSent
			});
			// alert(response.data.msg);
			const newMessage = {
				sender: sender._id,
				receiver: currentChat._id,
				message: msg
			};

			//whenever we send a message we also use sockets
			socket.current.emit('send-msg', newMessage);
			setMessages(prev => [...prev, newMessage]);
		}
		catch (err) {
			console.log(err);
		}

	}

	useEffect(()=>{
		if(socket.current){
			socket.current.on('msg-receive', (data)=>{
				setArrivalMessage(data);
			})
		}
	});

	useEffect(()=>{
		if(arrivalMessage) setMessages(prev=>[...prev, arrivalMessage]);
	}, [arrivalMessage]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	

	// console.log('welcome to chat container');
	// console.log(currentChat);
	const navigate = useNavigate();
	if (!localStorage.getItem('chat-app-user')) {
		navigate('/login');
		return null;
	}



	return (
		<Container>
			<div className="chat-header">
				<div className="user-details">
					<div className="avatar">
						<img
							src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
							alt=""
						/>
					</div>
					<div className="username">
						<h3>{currentChat.username}</h3>
					</div>
				</div>
			</div>
			<div className="chat-messages">
				{messages.map((message, index) => {
					return (
						<div ref={scrollRef} key={index}>
							<div
								className={`message ${message.sender === currentChat._id ? "received" : "sended"
									}`}
							>
								<div className="content ">
									<p>{message.message}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<ChatInput handleSendMsg={handleSendMsg} />
		</Container>
	)
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
	padding-top: 20px;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;


export default ChatContainer;


