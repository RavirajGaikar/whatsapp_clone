import React from 'react';

function Loading() {
  return (
    <div className='h-[100vh] grid place-items-center'>
      <div className='flex flex-col items-center'>
        <img style={{height:'200px',marginBottom:'10px'}} src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png"  alt="Whatsapp Loading"/>
      </div>
    </div>
  );
}

export default Loading;
