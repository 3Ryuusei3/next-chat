"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/lib/store/user';
import { Imessage, useMessages } from '@/lib/store/messages';

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessage = useMessages((state) => state.addMessage);

  const supabase = supabaseBrowser();
  const handleMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          display_name: user?.user_metadata.user_name,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
        }
      };
      addMessage(newMessage as Imessage);

      const { error } = await supabase.from('messages').insert({ text });
      if (error) {
        toast.message(error.message);
      }
    } else {
      toast.message('Message cannot be empty');
    }
  };

  return (
    <div className='p-5'>
      <Input placeholder='Send message...' onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleMessage(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} />
    </div>
  )
}
