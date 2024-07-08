import React, { Suspense } from 'react'
import MessageList from './MessageList'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/store/InitMessages';
import { Imessage } from '@/lib/store/messages';
import { LIMIT_MESSAGES } from "@/lib/constant";

export default async function ChatMessages() {

  const supabase = await supabaseServer();

  const { data } = await supabase
    .from('messages')
    .select("*,users(*)")
    .range(0, LIMIT_MESSAGES)
    .order('created_at', { ascending: false }) ?? { data: null };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessageList />
      <InitMessages messages={data?.reverse() as Imessage[] || null} />
    </Suspense>
  )
}
