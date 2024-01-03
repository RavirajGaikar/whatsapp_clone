import React from 'react';
import Head from 'next/head';
import {auth,provider} from '../firebase'

function Login() {

    const signIn = () =>{
        auth.signInWithPopup(provider).catch(alert);
    };

  return (
    <div className='h-[100vh] grid place-items-center bg-[whitesmoke]'>
      <Head>
        <title>Login</title>
      </Head>
      <div className='flex flex-col p-[100px] rounded-[5px] bg-white shadow-[0px 4px 14px -3px rgba(0,0,0,0.7)] items-center'>
        <img className='h-[200px] w-[200px] mb-[20px]' src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" alt=""/>
        <button className='rounded-[15px] p-[7px] hover:bg-gray-300' onClick={signIn}>Sign in with google</button>
      </div>
    </div>
  );
}

export default Login;
