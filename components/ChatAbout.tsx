import React from 'react'

export default function ChatAbout() {
  return (
    <div className='flex-1 flex items-center justify-center p-5'>
      <div className='text-center space-y-5'>
        <h1 className='text-3xl font-bold'>Welcome to next-chat</h1>
        <p>This is a chat application powered by supabase realtime database. Login to send a message.</p>
      </div>
    </div>
  )
}
