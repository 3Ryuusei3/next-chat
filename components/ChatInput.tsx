"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner';

export default function ChatInput() {
  const supabase = supabaseBrowser();

  const handleMessage = async (text: string) => {
    const { error } = await supabase.from('messages').insert({ text });
    if (error) {
      toast.message(error.message);
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
