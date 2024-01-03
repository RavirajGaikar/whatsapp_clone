import React from 'react';
import Avatar from '@mui/material/Avatar';
import {auth,db} from '../firebase.js';
import getReceipentEmail from '@/utility/getReceipentEmail.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';


function Chat({id,users}) {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const receipentEmail = getReceipentEmail(users,user);
    const [receipentNameref] = useCollection(db.collection('names').where('email','==',getReceipentEmail(users,user)));
    const receipentName=receipentNameref?.docs?.[0]?.data();
    
    const [receipentSnapshot] = useCollection(db.collection('users').where('email','==',getReceipentEmail(users,user)));
    const receipent = receipentSnapshot?.docs?.[0]?.data();


    const enterChat = () =>{
        router.push(`/chat/${id}`)
    }
  return (
    <div className='flex items-center cursor-pointer break-words hover:bg-[#e9eaeb] border-solid border-b-[1px] p-[5px] border-gray-300' onClick={enterChat}>
        {receipent? (
                <Avatar src={receipent?.photoURL} className='m-[5px] mr-[15px]'/>
            ):(<Avatar className='m-[5px] mr-[15px]'>{receipentEmail[0].toUpperCase()}</Avatar>)
        }
        {receipentName?.name?(<p>{receipentName.name}</p>):(<p>{receipentEmail}</p>)}
        
    </div>
  );
}

export default Chat;
