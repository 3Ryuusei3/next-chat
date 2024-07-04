"use client"

import React from 'react'
import { useMessages } from '@/lib/store/messages'
import { supabaseBrowser } from '@/lib/supabase/browser';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';


export default function DeleteAlert() {
  const actionMessage = useMessages((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessages((state) => state.optimisticDeleteMessage);
  const handleDeleteMessage = async () => {
    const supabase = supabaseBrowser();
    optimisticDeleteMessage(actionMessage?.id!)

    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', actionMessage?.id!);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Message deleted successfully');
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><button id="trigger-delete"></button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete message</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the message from the chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}
