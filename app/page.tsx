import React from 'react'

import { supabaseServer } from '@/lib/supabase/server'
import InitUser from '@/lib/store/InitUser';
import ChatHeader from '@/components/ChatHeader'
import ChatInput from '@/components/ChatInput';
import ChatMessages from '@/components/ChatMessages';

export default async function Page() {

  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser() ?? { data: null };

  return (
    <>
      <div className='max-w-3xl mx-auto md:my-10 h-screen'>
        <div className='h-full border rounded-md flex flex-col relative'>
          <ChatHeader user={data?.user} />
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
      <InitUser user={data?.user}  />
    </>
  )
}
