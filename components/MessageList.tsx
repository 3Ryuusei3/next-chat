"use client"

import { Imessage, useMessages } from '@/lib/store/messages'
import React, { useEffect, useRef } from 'react'
import Message from './Message';
import { DeleteAlert, EditAlert } from './MessageActions';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';

export default function MessageList() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const {
    messages,
    addMessage,
    optimiticsIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage
  } = useMessages((state) => state);
  const supabase = supabaseBrowser();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // console.log('Message inserted', payload);
          if (!optimiticsIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select('*')
              .eq('id', payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data
              }
              addMessage(newMessage as Imessage);
            }
          }
        }
      )
      .on (
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          // console.log('Message deleted', payload);
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on (
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          // console.log('Message updated', payload);
          optimisticUpdateMessage(payload.new as Imessage);
        }
      )
      .subscribe();

      return () => {
        channel.unsubscribe();
      }
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages])

  return (
    <div className='flex-1 flex flex-col p-5 h-full overflow-y-auto' ref={scrollRef}>
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
      <EditAlert />
    </div>
  )
}
