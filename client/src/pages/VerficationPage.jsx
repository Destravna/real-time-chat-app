import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { verify, getCode } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const VerficationPage = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        // console.log(e.target.value);
        setCode(e.target.value);
    }

    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
            const user = JSON.parse(localStorage.getItem('chat-app-user')); 
            if(user.isVerified){
                navigate('/chat');
            }
        }
       
    })


    const handleClick = async(e)=>{
        e.preventDefault();
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const response = await axios({
            method:'POST',
            url : verify,
            data : {
                userId : user._id,
                token : code 
            } 
        });
        console.log(response.data);
        const result = response.data;
        if(result.status){
            localStorage.setItem('chat-app-user', JSON.stringify(result.user));
            console.log(result.user);
            navigate('/chat');
        }
        alert(result.msg);
    }


    //handle resend code
    const handleResend = async(e)=>{
        e.preventDefault();
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const response = await axios({
            method : 'GET',
            url : getCode,
            params: user
        });
        const result = response.data;
        alert(result.msg);    
    }

    return (
        <FormContainer>
            <div className='head'><h2>Enter 6 digit verification code</h2></div>
            <input
                type="text"
                placeholder="6 digit code"
                name="code"
                onChange={(e) => handleChange(e)}
            />
            <button onClick={handleClick}>Verify</button>
            <button onClick={handleResend}>Resend Code</button>
        </FormContainer>

    )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .head{
    color : white;
  };
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 80%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;


export default VerficationPage;
