"use client"

import React, { useEffect, useRef } from 'react'
import { Imessage, useMessages } from './messages';
import { LIMIT_MESSAGES } from '../constant';

export default function InitMessages({ messages }: {messages: Imessage[] }) {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGES;

  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages, hasMore });
    }

    initState.current = true;
    // eslint-disable-next-line
  }, [])

  return <></>
}
