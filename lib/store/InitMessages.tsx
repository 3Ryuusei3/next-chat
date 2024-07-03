"use client"

import React, { useEffect, useRef } from 'react'
import { Imessage, useMessages } from './messages';

export default function InitMessages({ messages }: {messages: Imessage[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages });
    }

    initState.current = true;
    // eslint-disable-next-line
  }, [])

  return <></>
}
