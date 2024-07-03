import React from 'react'

import ChatHeader from '@/components/ChatHeader'
import { supabaseServer } from '@/lib/supabase/server'
import InitUser from '@/lib/store/initUser';

export default async function Page() {

  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser() ?? { data: null };

  return (
    <>
      <div className='max-w-3xl mx-auto md:my-10 h-screen'>
        <div className='h-full border rounded-md'>
          <ChatHeader user={data?.user} />
        </div>
      </div>
      <InitUser user={data?.user}  />
    </>
  )
}
