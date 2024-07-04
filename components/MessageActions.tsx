"use client"

import React, { useRef } from 'react'
import { Imessage, useMessages } from '@/lib/store/messages'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { toast } from 'sonner';

export function DeleteAlert() {
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
export function EditAlert() {
  const actionMessage = useMessages((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessages((state) => state.optimisticUpdateMessage);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleEdit = async () => {
    const supabase = supabaseBrowser();
    const text = inputRef.current.value.trim();
    if (text) {
      optimisticUpdateMessage({
        ...actionMessage,
        text,
        is_edit: true
      } as Imessage)
      const { data, error } = await supabase
        .from('messages')
        .update({ text, is_edit: true })
        .eq('id', actionMessage?.id!);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Message updated successfully');
      }
      document.getElementById('trigger-edit')?.click();
    } else {
      document.getElementById('trigger-edit')?.click();
      document.getElementById('trigger-delete')?.click();
    }
  }

  return (
    <Dialog>
			<DialogTrigger asChild>
				<button id="trigger-edit"></button>
			</DialogTrigger>
			<DialogContent className="w-full">
				<DialogHeader>
					<DialogTitle>Edit Message</DialogTitle>
				</DialogHeader>
				<Input defaultValue={actionMessage?.text} id="message" ref={inputRef} />
				<DialogFooter>
					<Button onClick={handleEdit}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
  )
}
