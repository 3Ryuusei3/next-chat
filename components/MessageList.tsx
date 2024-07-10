"use client"

import { Imessage, useMessages } from '@/lib/store/messages'
import React, { useState, useEffect, useRef } from 'react'
import Message from './Message';
import LoadMoreMessages from './LoadMoreMessages';
import { DeleteAlert, EditAlert } from './MessageActions';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import { ArrowDown } from 'lucide-react';

export default function MessageList() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState<boolean>(false);
  const [notification, setNotification] = useState<number>(0);
  const {
    messages,
    addMessage,
    optimisticIds,
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
					if (!optimisticIds.includes(payload.new.id)) {
						const { error, data } = await supabase
							.from("users")
							.select("*")
							.eq("id", payload.new.send_by)
							.single();
						if (error) {
							toast.error(error.message);
						} else {
							const newMessage = {
								...payload.new,
								users: data,
							};
							addMessage(newMessage as Imessage);
						}
					}
					const scrollContainer = scrollRef.current;
					if (
						scrollContainer.scrollTop <
						scrollContainer.scrollHeight -
							scrollContainer.clientHeight -
							10
					) {
						setNotification((current) => current + 1);
					}
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "messages" },
				(payload) => {
					optimisticDeleteMessage(payload.old.id);
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "messages" },
				(payload) => {
					optimisticUpdateMessage(payload.new as Imessage);
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScrolling = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScrolling);
    }
    if (scrollContainer.scrollTop === scrollContainer.scrollHeight - scrollContainer.clientHeight) {
      setNotification(0);
    }
  }

  const scrollToBottom = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setNotification(0);
  }

  return (
    <div
      className='flex-1 flex flex-col p-5 h-full overflow-y-auto'
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className='flex-1 pb-5'>
        <LoadMoreMessages />
      </div>
      <div className='space-y-7'>
        {messages.map((value, index) => {
          return (
            <Message key={index} message={value} />
          )
        })}
      </div>
      {userScrolled && (
        <div className='absolute bottom-20 right-1/2 translate-x-1/2'>
          {notification > 0 ? (
            <div
              className='w-36 bg-purple-600 flex justify-center items-center rounded-md p-1 cursor-pointer hover:scale-105 hover:bg-purple-700 transition-all'
              onClick={scrollToBottom}
            >
              <h1>{notification} new message{notification === 1 ? '' : 's'}</h1>
            </div>
          ) : (
            <div
              className='w-10 h-10 bg-purple-600 rounded-full flex justify-center items-center mx-auto border cursor-pointer hover:scale-105 hover:bg-purple-700 transition-all'
              onClick={scrollToBottom}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
      <DeleteAlert />
      <EditAlert />
    </div>
  )
}
