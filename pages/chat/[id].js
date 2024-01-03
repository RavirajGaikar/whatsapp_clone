import ChatScreen from '@/components/ChatScreen';
import Sidebar from '@/components/Sidebar';
import Head from 'next/head';
import React from 'react';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getReceipentEmail from '@/utility/getReceipentEmail';

function Chat({chat,messages}) {

    const [user] = useAuthState(auth);
  return (
    <div className='flex'>
      <Head>
        <title>Chat with {getReceipentEmail(chat.users,user)}</title>
      </Head>
      <Sidebar call={false}/>
      <div className='flex-[1] h-[100vh] overflow-scroll custom-scrollbar'>
        <ChatScreen chat={chat} messages={messages}/>
      </div>
    </div>
  );
}

export default Chat;

export async function getServerSideProps(context){
    const ref= db.collection("chats").doc(context.query.id);

    const MessagesRes = await ref.collection('messages').orderBy('timestamp','asc').get();

    const messages = MessagesRes.docs.map((doc) => ({
        id:doc.id,
        ...doc.data()
    })).map((messages) => ({
        ...messages,
        timestamp:messages.timestamp.toDate().getTime()
    }));

    const chatRes = await ref.get();
    const chat = {
        id:chatRes.id,
        ...chatRes.data()
    }

    return{
        props:{
            messages:JSON.stringify(messages),
            chat:chat
        }
    }
}
