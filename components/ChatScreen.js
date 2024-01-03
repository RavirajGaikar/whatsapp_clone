import { auth,db } from '@/firebase';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import getReceipentEmail from '@/utility/getReceipentEmail';
import TimeAgo from 'timeago-react';
import styled from 'styled-components';

function ChatScreen({chat,messages}) {
    {/*Starting component */}
    const[user] = useAuthState(auth);
    const router = useRouter();
    const [input,setInput] = useState('');
    const [messageSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'));
    const [receipentSnapshot] = useCollection(db.collection('users').where('email','==',getReceipentEmail(chat.users,user)))
    const endOfMessageRef = useRef(null);

    const showMessages=()=>{
      if (messageSnapshot){
        return messageSnapshot.docs.map((message)=>(
          <Message key={message.id} user={message.data().user}
           message={{
            ...message.data(),
            timestamp:message.data().timestamp?.toDate().getTime(),
           }}/>
        ))
      }else{
        return JSON.parse(messages).map((message)=>(
          <Message key={message.id} user={message.user} message={message}/>
        ))
      }
    }

    const scrollToBottom = () =>{
      endOfMessageRef.current.scrollIntoView({
        behavior:"smooth",
        block:"start",
      });
    }

    const sendMessage = (e) =>{
      e.preventDefault();

      if(!input){
        return;
      }

      db.collection('users').doc(user.uid).set(
        {
          lastSeen:firebase.firestore.FieldValue.serverTimestamp(),
        },{merge:true}
      );

      db.collection('chats').doc(router.query.id).collection('messages').add(
        {
          timestamp:firebase.firestore.FieldValue.serverTimestamp(),
          user:user.email,
          message:input,
          photoURL:user.photoURL,
        }
      );

      setInput('');
      scrollToBottom();
    };

    const receipent = receipentSnapshot?.docs?.[0]?.data();
    const receipentEmail= getReceipentEmail(chat.users,user);

    const [receipentNameref] = useCollection(db.collection('names').where('email','==',getReceipentEmail(chat.users,user)));
    const receipentName=receipentNameref?.docs?.[0]?.data();

    const changeName = () =>{
      if(receipentName){
        alert("Name already Modified");
        return null;
      }
        const newname=prompt('Enter New Name');
        db.collection('names').add({
          name:newname,
          email:receipentEmail,
        })
    };

  return (
    <div>
      <div className='sticky z-[100] top-0 flex h-[55px] items-center p-[11px] border-b-[1px] border-solid bg-[#f0f2f5] border-[whitesmoke]'>
        {receipent ? (
          <Avatar src={receipent?.photoURL} onClick={changeName}/>
        ):(
          <Avatar onClick={changeName}>{receipentEmail[0].toUpperCase()}</Avatar>
        )}
        <div className='ml-2 flex-[1] '>
          {receipentName?.name?(
            <h3 className='mb-[3px]'>{receipentName?.name}</h3>
          ):(
            <h3 className='mb-[3px]'>{receipentEmail}</h3>
          )}
          {receipentSnapshot?(
            <p className='text-[14px] mt-[-4px] text-gray-500'>Last Seen:{' '}
            {receipent?.lastSeen?.toDate()?(
              <TimeAgo datetime={receipent?.lastSeen?.toDate()} />
            ):"Unavailable"}
            </p>
          ):(
            <p className='text-[14px] mt-[-4px] text-gray-500'>Loading Last Active..</p>
          )}
        </div>
        <AttachFileIcon/>
        <MoreVertIcon/>
      </div>
      <div className='p-[30px] bg-[#e5ded8] min-h-[90vh]'>
        {showMessages()}
        <EndofMessage ref={endOfMessageRef}/>
      </div>
      <div className='flex items-center p-[10px] bottom-0 h-[60px] sticky bg-[#f0f2f5] '>
        <InsertEmoticonIcon/>
        <form className='w-full flex-[1] rounded-[10px] ml-[5px]' onSubmit={sendMessage}>
          <input value={input} onChange={(e)=> setInput(e.target.value)} className='flex-[1] bg-white outline-0 border-none rounded-[10px] p-[10px] pl-[15px] pr-[15px] w-full' type='text' placeholder='Chat'/>
        </form>
        <MicIcon/>
      </div>
    </div>
  );
}

export default ChatScreen;

const EndofMessage = styled.div`
  margin-bottom:50px;
`;
