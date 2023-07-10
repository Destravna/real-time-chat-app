import React, { useEffect, useState } from 'react'
import Logo from "../assets/logo.svg";
import { styled } from 'styled-components';
import Logout from './Logout';

const Contacts = ({ contacts, changeChat }) => {

	const storedUser = localStorage.getItem('chat-app-user');
	const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
	const [currentSelected, setCurrentSelected] = useState(undefined);
	const changeCurrentChat = (index, contact) => {
		setCurrentSelected(index);
		changeChat(contact);
	};
	if(!user){
		return null;
	}
	contacts = contacts.filter(obj => obj._id !== user._id);
	return (
		<Container>
			<div className="brand">
				<img src={Logo} alt="logo" />
				<h3>snappy</h3>
			</div>
			<div className="contacts">
				{contacts.map((contact, index) => {
					return (
						<div
							key={contact._id}
							className={`contact ${index === currentSelected ? "selected" : ""
								}`}
							onClick={() => changeCurrentChat(index, contact)}
						>
							<div className="avatar">
								<img
									src={`data:image/svg+xml;base64,${contact.avatarImage}`}
									alt=""
								/>
							</div>
							<div className="username">
								<h3>{contact.username}</h3>
							</div>
						</div>
					);
				})}
			</div>
			<div className="current-user">
				<div className="avatar">
					<img
						src={`data:image/svg+xml;base64,${user.avatarImage}`}
						alt="avatar"
					/>
				</div>
				<div className="username">
					{user.username}
				</div>
        <Logout/>
			</div>

		</Container>
	)
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  font-size: 14px;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
	  font-size:10px;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
	min-height: 2rem;
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
	width:95%:
    gap: 2rem;
    .avatar {
      img {
        height: 3rem;
        max-inline-size: 100%;
		padding:10px;
      }
    }
    .username {
		font-size:14px;
        color: white;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
		font-size: 14px;
		color:white;
      }
    }
  }
`;


export default Contacts;