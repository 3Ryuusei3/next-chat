import React, { Suspense } from 'react'
import MessageList from './MessageList'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/store/InitMessages';
import { Imessage } from '@/lib/store/messages';

export default async function ChatMessages() {

  const supabase = await supabaseServer();

  const { data } = await supabase.from('messages').select("*,users(*)");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessageList />
      <InitMessages messages={data as Imessage[] || null} />
    </Suspense>
  )
}
