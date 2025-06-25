import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, Menu, ThumbsUp, ThumbsDown, Copy, RotateCcw, Share } from 'lucide-react'
import { MarkdownText } from '../lib/markdown.jsx'

export default function ChatArea({
  currentChatId,
  messages,
  onMessagesUpdate,
  onSendMessage,
  user,
  isMobile,
  isLoading,
  onOpenSidebar
}) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || isLoading) return

    if (onSendMessage) {
      onSendMessage(messageContent)
      setInputMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputMessage)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (!currentChatId) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenSidebar}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3 focus:outline-none"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900">CuAI</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <Share className="h-4 w-4" />
            <span className="ml-2 text-sm hidden sm:inline">Share</span>
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Welcome to CuAI</h2>
            <p className="text-gray-600 leading-relaxed">
              Hello! How can I help you today?
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenSidebar}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3 focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            {isMobile && (
              <>
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h1 className="text-lg font-medium text-gray-900">CuAI</h1>
              </>
            )}
            {!isMobile && (
              <>
                <span className="text-lg font-medium text-gray-900">
                  {messages.length > 0 ? messages[0].content.slice(0, 30) + '...' : 'New Chat'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <Share className="h-4 w-4" />
          <span className="ml-2 text-sm hidden sm:inline">Share</span>
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden pb-24">
        <div className="chat-area-scroll">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((message, index) => (
              <div key={message.id} className="mb-8">
                {message.role === 'user' ? (
                  <div className="flex items-start space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        <MarkdownText>{message.content}</MarkdownText>
                      </div>
                      {index === messages.length - 1 && (
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            onClick={() => copyToClipboard(message.content)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 h-8 focus:outline-none"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 h-8 focus:outline-none"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 h-8 focus:outline-none"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 h-8 focus:outline-none"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span className="ml-1 text-xs">Retry</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="fixed-input-area chat-input-container">
        <div className="max-w-3xl mx-auto p-4">
          <div className="relative flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="How can I help you today?"
                className="w-full min-h-[48px] max-h-32 resize-none bg-transparent border-0 text-gray-900 placeholder-gray-500 rounded-2xl px-4 py-3 pr-12 transition-all duration-200 focus:outline-none focus:ring-0"
                disabled={isLoading}
                rows={1}
              />
              <Button
                onClick={() => {
                  if (onSendMessage) {
                    onSendMessage(inputMessage)
                    setInputMessage('')
                  } else {
                    handleSendMessage(inputMessage)
                  }
                }}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="send-button absolute right-2 bottom-2 h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Footer text */}
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              CuAI can make mistakes. Please double-check responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


