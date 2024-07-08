import React from 'react'
import { Button } from './/ui/button';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { LIMIT_MESSAGES } from "@/lib/constant";
import { getFromAndTo } from '@/lib/utils';
import { useMessages } from '@/lib/store/messages';
import { toast } from 'sonner';

export default function LoadMoreMessages() {
  const page = useMessages((state) => state.page);
  const setMessages = useMessages((state) => state.setMessages);
  const hasMore = useMessages((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGES);
    const supabase = await supabaseBrowser();;

    const { data, error } = await supabase
    .from('messages')
    .select("*,users(*)")
    .range(from, to)
    .order('created_at', { ascending: false }) ?? { data: null };

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data?.reverse());
    }
  }

  if (hasMore) {
    return (
      <Button variant="outline" className='w-full' onClick={fetchMore}>Load More</Button>
    )
  }
  return <></>
}
