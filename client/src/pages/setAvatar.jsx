import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/api";
export default function SetAvatar() {
    const api = `https://api.multiavatar.com/4645646`;
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const getImages = async () => {
        try {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios({
                    method: 'get',
                    url: `${api}/${Math.round(Math.random() * 1000)}`

                })
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            alert('please select an avatar');
        }
        else {
            const currentUser = JSON.parse(localStorage.getItem('chat-app-user'));
            // console.log(avatars[selectedAvatar]);
            currentUser['avatarImage'] = avatars[selectedAvatar];
            try {
                const response = await axios({
                    method: 'POST',
                    url: setAvatarRoute,
                    data: currentUser
                });
                const result = response.data;
                if(result.status){
                    // console.log(result.user);
                    localStorage.setItem('chat-app-user', JSON.stringify(result.user));
                }
                alert(result.msg);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        let currentUser = localStorage.getItem('chat-app-user');
        if (currentUser === 'undefined') {
            navigate('/login');
        }
        if(!currentUser){
            navigate('/login');   
        }
        getImages();
    },)

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div 
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""
                                        }`}
                                    key={index}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        key={avatar}
                                        onClick={() => setSelectedAvatar(index)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;
