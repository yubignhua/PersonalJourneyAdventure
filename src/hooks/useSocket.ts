import { useEffect, useRef } from 'react'
import { socketManager } from '@/lib/socket'
import type { Socket } from 'socket.io-client'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = socketManager.connect()

    return () => {
      socketManager.disconnect()
    }
  }, [])

  const emit = (event: string, data?: any) => {
    socketManager.emit(event, data)
  }

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketManager.on(event, callback)
  }

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socketManager.off(event, callback)
  }

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketRef.current?.connected || false,
  }
}