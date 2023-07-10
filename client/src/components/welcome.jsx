import React, { useState } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
const Welcome = () => {
    const storedUser = localStorage.getItem('chat-app-user');
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
    if (!user) return null;
    return (
        <Container>
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{user.username}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome;