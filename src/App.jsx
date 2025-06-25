import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { generateResponse } from './lib/gemini'
import Auth from './components/Auth'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { v4 as uuidv4 } from 'uuid'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Control body scroll when sidebar is open on mobile
    if (isMobile && sidebarOpen) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
    
    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session) {
        setChats([])
        setCurrentChatId(null)
        setMessages([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      loadChats()
      createUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId)
    } else {
      setMessages([])
    }
  }, [currentChatId])

  const createUserProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
      }
    } catch (error) {
      console.error('Error with profile:', error)
    }
  }

  const loadChats = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error('Error loading chats:', error)
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.created_at
      }))
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleNewChat = async () => {
    if (!user) return

    try {
      const chatId = uuidv4()
      const { error } = await supabase
        .from('chats')
        .insert({
          id: chatId,
          user_id: user.id,
          title: 'New Chat',
        })

      if (error) throw error

      const newChat = {
        id: chatId,
        title: 'New Chat',
        created_at: new Date().toISOString(),
        user_id: user.id
      }

      setChats([newChat, ...chats])
      setCurrentChatId(chatId)
      
      if (isMobile) {
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId)
    
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleDeleteChat = async (chatId) => {
    if (!user) return

    try {
      // Delete messages first
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('chat_id', chatId)

      if (messagesError) throw messagesError

      // Delete chat
      const { error: chatError } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id)

      if (chatError) throw chatError

      // Update local state
      const updatedChats = chats.filter(chat => chat.id !== chatId)
      setChats(updatedChats)

      // If deleted chat was current, switch to another or clear
      if (currentChatId === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id)
        } else {
          setCurrentChatId(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleMessagesUpdate = async (newMessages) => {
    setMessages(newMessages)
    
    // Update chat title if it's a new chat
    if (currentChatId && newMessages.length > 0) {
      const currentChat = chats.find(chat => chat.id === currentChatId)
      if (currentChat && currentChat.title === 'New Chat') {
        const firstMessage = newMessages.find(msg => msg.role === 'user')
        if (firstMessage) {
          const newTitle = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '')
          
          try {
            const { error } = await supabase
              .from('chats')
              .update({ title: newTitle })
              .eq('id', currentChatId)

            if (!error) {
              setChats(chats.map(chat => 
                chat.id === currentChatId 
                  ? { ...chat, title: newTitle }
                  : chat
              ))
            }
          } catch (error) {
            console.error('Error updating chat title:', error)
          }
        }
      }
    }
  }

  const handleSendMessage = async (messageContent) => {
    if (!currentChatId || !user) return

    const userMessage = {
      id: uuidv4(),
      content: messageContent,
      role: 'user',
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      // Save user message to database
      const { error: userError } = await supabase
        .from('messages')
        .insert({
          id: userMessage.id,
          chat_id: currentChatId,
          content: messageContent,
          role: 'user',
          user_id: user.id
        })

      if (userError) throw userError

      // Generate AI response using Gemini
      const aiResponseText = await generateResponse(
        messageContent,
        messages.map(msg => ({ role: msg.role, content: msg.content }))
      )

      const aiMessage = {
        id: uuidv4(),
        content: aiResponseText,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)

      // Save AI message to database
      const { error: aiError } = await supabase
        .from('messages')
        .insert({
          id: aiMessage.id,
          chat_id: currentChatId,
          content: aiMessage.content,
          role: 'assistant',
          user_id: user.id
        })

      if (aiError) throw aiError

      // Update chat title if needed
      await handleMessagesUpdate(finalMessages)

    } catch (error) {
      console.error('Error sending message:', error)
      // Remove the user message if there was an error
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = (session) => {
    setSession(session)
    setUser(session.user)
  }

  const handleSignOut = () => {
    setSession(null)
    setUser(null)
    setChats([])
    setCurrentChatId(null)
    setMessages([])
    setSidebarOpen(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-80`
          : 'relative w-80'
        }
      `}>
        <Sidebar
          user={user}
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onSignOut={handleSignOut}
          isMobile={isMobile}
          onClose={closeSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Area */}
        <ChatArea
          messages={messages}
          onMessagesUpdate={handleMessagesUpdate}
          onSendMessage={handleSendMessage}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          user={user}
          isMobile={isMobile}
          isLoading={isLoading}
          onOpenSidebar={toggleSidebar}
        />
      </div>
    </div>
  )
}

export default App