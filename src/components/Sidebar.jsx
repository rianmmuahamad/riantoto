import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, MessageSquare, LogOut, User, X, Settings, Crown, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Sidebar({ 
  user, 
  chats, 
  currentChatId, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat,
  onSignOut,
  isMobile,
  onClose
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut()
  }

  return (
    <div className={`bg-white border-r border-gray-200 sidebar-scroll flex flex-col ${
      isMobile ? 'w-80' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h1 className="text-lg font-medium text-gray-900">CuAI</h1>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg h-10"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start new chat
        </Button>
      </div>

      {/* Plan Badge */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-900">Free plan</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-sm font-medium h-auto p-1"
          >
            Upgrade
          </Button>
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group relative flex items-center rounded-lg transition-colors ${
                currentChatId === chat.id 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Button
                variant="ghost"
                className={`flex-1 justify-start text-left h-auto p-3 rounded-lg transition-colors ${
                  currentChatId === chat.id 
                    ? 'bg-transparent text-gray-900' 
                    : 'text-gray-700 hover:bg-transparent hover:text-gray-900'
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0 mr-2" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="truncate text-sm font-medium">
                    {chat.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(chat.created_at)}
                  </div>
                </div>
              </Button>
              
              {/* Delete Button - appears on hover */}
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 absolute right-2 h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat && onDeleteChat(chat.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile & Settings */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 h-10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 h-10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}