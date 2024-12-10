'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send } from 'lucide-react'

interface ChatRoom {
  id: number
  name: string
  lastMessage: string
  timestamp: string
}

interface User {
  id: number
  name: string
}

interface Message {
  id: number
  senderId: number
  content: string
  timestamp: string
}

const dummyChatRooms: ChatRoom[] = [
  { id: 1, name: "강아지 모임", lastMessage: "다음 모임은 언제인가요?", timestamp: "14:30" },
  { id: 2, name: "고양이 집사", lastMessage: "새 장난감 추천해주세요!", timestamp: "어제" },
]

const dummyUsers: User[] = [
  { id: 1, name: "김철수" },
  { id: 2, name: "이영희" },
  { id: 3, name: "박지성" },
]

const dummyMessages: Message[] = [
  { id: 1, senderId: 1, content: "안녕하세요!", timestamp: "14:30" },
  { id: 2, senderId: 2, content: "네, 안녕하세요. 무엇을 도와드릴까요?", timestamp: "14:31" },
]

export default function MessagesPage() {
  const [chatRooms] = useState<ChatRoom[]>(dummyChatRooms)
  const [users] = useState<User[]>(dummyUsers)
  const [messages] = useState<Message[]>(dummyMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showSearch, setShowSearch] = useState(true)
  const lastScrollTop = useRef(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredItems = searchQuery
    ? users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : chatRooms

  const handleItemClick = (item: ChatRoom | User) => {
    if ('lastMessage' in item) {
      setSelectedChatRoom(item as ChatRoom)
    } else {
      console.log("Opening chat with user:", item.name)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage)
      setNewMessage('')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop.current) {
        // 아래로 스크롤
        setShowSearch(false)
      } else if (st < lastScrollTop.current - 5) {
        // 위로 스크롤 (5px 이상)
        setShowSearch(true)
      }
      lastScrollTop.current = st <= 0 ? 0 : st
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#f3d7d0]">
      {!selectedChatRoom ? (
        <div className="flex-1 p-4 overflow-y-auto">
          <div 
            ref={searchRef}
            className={`sticky top-0 z-10 bg-[#f3d7d0] pt-4 pb-2 transition-all duration-300 ${
              showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
          >
            <Input
              type="text"
              placeholder="사용자 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          {filteredItems.map((item: ChatRoom | User) => (
            <Card
              key={item.id}
              className="mb-2 p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => handleItemClick(item)}
            >
              {'lastMessage' in item ? (
                <>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{(item as ChatRoom).lastMessage}</div>
                  <div className="text-xs text-gray-400">{(item as ChatRoom).timestamp}</div>
                </>
              ) : (
                <div className="font-semibold">{item.name}</div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#b38c84] text-white p-4">
            <h2 className="text-xl font-semibold">{selectedChatRoom.name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg ${
                  message.senderId === 1 ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                } max-w-[70%]`}
              >
                <p>{message.content}</p>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white">
            <div className="flex">
              <Input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

