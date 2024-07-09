"use client"
import { useUser } from '@/lib/store/user'
import { supabaseBrowser } from '@/lib/supabase/browser';
import React, { useState, useEffect } from 'react'

export default function ChatPressence() {
  const user = useUser(state => state.user);
  const supabase = supabaseBrowser();
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  useEffect(() => {
    const channel = supabase.channel('room1')
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Synced presence state: ', channel.presenceState());
        const userIds = new Set();
        Object.values(channel.presenceState()).forEach(presences => {
          presences.forEach(presence => {
            // @ts-ignore
            userIds.add(presence.user_id);
          });
        });
        setOnlineUsers(userIds.size);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id
          })
        }
      })
  }, [user])

  if (!user) {
    <div className="h-3 w-1"></div>
  }

  return (
    <div className='flex items-center gap-1'>
      <div className='h-4 w-4 bg-green-500 rounded-full animate-pulse'></div>
      <h1 className='text-sm text-gray-400'>{onlineUsers} online</h1>
    </div>
  )
}
