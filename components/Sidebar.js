import React from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {auth,db} from '../firebase';
import EmailValidator from 'email-validator';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import Chat from './Chat.js';
import styled from 'styled-components';
import {useRouter } from 'next/router';

export default function Sidebar({call=true}) {
    const [user] = useAuthState(auth);
    if(!user){
        return null;
    }
    const userChatRef = user ? db.collection('chats').where('users','array-contains',user.email) : null;
    const [chatsSnapshot] = useCollection(userChatRef);
    const router = useRouter();

    const handleSignOut = () =>{
        auth.signOut();
        router.push('/');
    }

    const createChat = () =>{
        const input=prompt("Please enter email address to chat with");
        if (!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input!==user.email){
            db.collection("chats").add({
                users:[user.email,input],
            })
            const name=prompt("Enter Name of User");
            if(name){
                db.collection('names').add(
                    {
                      name:name,
                      email:input,
                    }
                  );
            }
        }

        
    };

    const chatAlreadyExists = (receipentEmail) =>
        !!chatsSnapshot?.docs.find((chat)=>chat.data().users.find((user)=>user===receipentEmail)?.length>0);

  return (
    <div className='flex'>
    <Container>
        {/*Header*/}
        <div className='flex justify-between items-center p-[10px] sticky top-0 bg-[#f0f2f5]'>
            <Avatar style={{height:'35px',width:'35px'}} src={user.photoURL} onClick={handleSignOut}/>
            <div>
                <ChatIcon style={{color:'gray',height:'20px',width:'20px',marginRight:'6px'}}/>
                <MoreVertIcon style={{color:'gray',height:'20px',width:'20px'}}/>
            </div>
        </div>
        <div className='m-[10px] mb-[5px] flex rounded-[5px] p-[7px] items-center bg-[#f0f2f5]'>
            <SearchIcon style={{color:'gray',height:'20px',width:'20px'}}/>
            <input className='outline-none pl-[5px] w-[85%] bg-inherit' type='text' placeholder='Search...'/>
        </div>
        {/*Start new chat */}
        <div className='text-center p-[5px] hover:bg-[whitesmoke] text-gray-500 cursor-pointer' onClick={createChat}>
            <button>Click here to start new chat</button>
        </div>
        <div>
            {chatsSnapshot?.docs.map((chat)=>(
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))}
        </div>
    </Container>
    {call ? (<div className= 'bg-[#e5ded8] grid place-content-center items-center flex-[1]'>
            <img className='object-contain w-[500px]' src='https://static.whatsapp.net/rsrc.php/v3/y7/r/DSxOAUB0raA.png' alt='Whatsapp Image'/>
        </div>):(
            <div></div>
        )}
    </div>
  );
}

const Container = styled.div`
    flex:0.45;
    border-right: 1px solid whitesmoke;
    height:100vh;
    min-width:300px;
    max-width:350px;
    overflow-y:scroll;

    &::-webkit-scrollbar{
        display:none;
    };

    -ms-overflow-style:none;
    scrollbar-width:none;
`;
