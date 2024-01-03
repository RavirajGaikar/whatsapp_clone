import { auth } from '@/firebase';
import moment from 'moment';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';

function Message({user,message}) {

  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user===userLoggedIn.email? Sender : Receiver;

  return (
    <div>
      <TypeOfMessage>{message.message}
      <span className='p-[10px] text-gray-500 text-[9px] absolute bottom-0 right-0 text-right'>
      {message.timestamp? moment(message.timestamp).format('LT'):'...'}
      </span>
      </TypeOfMessage>
    </div>
  );
}

export default Message;

const MessageElement = styled.p`
  width:fit-content;
  padding:15px;
  padding-bottom:20px;
  border-radius:8px;
  margin:10px;
  min-width:60px;
  position:relative;
  text-align:right;
`;

const Sender = styled(MessageElement)`
  margin-left:auto;
  background-color:#dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color:whitesmoke;
  text-align:left;
`;
