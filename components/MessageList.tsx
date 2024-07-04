"use client"

import { useMessages } from '@/lib/store/messages'
import React from 'react'
import Message from './Message';
import DeleteAlert from './MessageActions';

export default function MessageList() {
  const messages = useMessages((state) => state.messages);

  return (
    <div className='flex-1 flex flex-col p-5 h-full overflow-y-auto'>
      <div className='flex-1 '>

      </div>
      <div className='space-y-7'>
        {messages.map((value, index) => {
          return (
            <Message key={index} message={value} />
          )
        })}
      </div>
      <DeleteAlert />
    </div>
  )
}
