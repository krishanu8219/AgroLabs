'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useUser } from '@clerk/nextjs';
import { saveChatMessage, getChatHistory } from '@/lib/chat-storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string; // Separate thinking content
  isTyping?: boolean; // For typewriter effect
}

const SUGGESTED_QUESTIONS = [
  "What's the current health status of my corn field?",
  "Should I irrigate based on today's satellite imagery?",
  "Are there any pest or disease risks detected?",
  "What's the weather forecast for the next week?",
  "When is the best time to fertilize my crops?",
  "How can I improve my crop yield this season?"
];

export function ChatInterface() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [expandedThinking, setExpandedThinking] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user?.id) {
        setIsLoadingHistory(false);
        return;
      }
      
      setIsLoadingHistory(true);
      try {
        console.log('Loading chat history for user:', user.id);
        const history = await getChatHistory(user.id);
        console.log('Loaded history:', history);
        
        if (history.length > 0) {
          const formattedMessages = history.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            thinking: msg.thinking,
            timestamp: new Date(msg.created_at),
          }));
          setMessages(formattedMessages);
          console.log('Set formatted messages:', formattedMessages);
          
          // Scroll to bottom after loading history
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup typewriter timeout on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  // Function to extract thinking content from response
  const extractThinking = (content: string): { thinking: string; response: string } => {
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) {
      const thinking = thinkMatch[1].trim();
      const response = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
      return { thinking, response };
    }
    return { thinking: '', response: content };
  };

  // Typewriter effect function
  const typewriterEffect = (fullContent: string, messageIndex: number, thinking: string = '') => {
    const words = fullContent.split(' ');
    let currentIndex = 0;

    const typeNextWord = () => {
      if (currentIndex < words.length) {
        const currentText = words.slice(0, currentIndex + 1).join(' ');
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: currentText,
            thinking,
            isTyping: true,
          };
          return newMessages;
        });

        currentIndex++;
        typewriterTimeoutRef.current = setTimeout(typeNextWord, 50); // 50ms per word
      } else {
        // Typing complete
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[messageIndex] = {
            ...newMessages[messageIndex],
            content: fullContent,
            thinking,
            isTyping: false,
          };
          return newMessages;
        });
      }
    };

    typeNextWord();
  };

  const toggleThinking = (index: number) => {
    setExpandedThinking(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    // Save user message to database
    try {
      await saveChatMessage({
        user_id: user.id,
        role: 'user',
        content: textToSend,
      });
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      // Extract thinking from response
      const { thinking, response: actualResponse } = extractThinking(data.message);

      // Add placeholder message
      const messageIndex = messages.length + 1;
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        thinking: thinking || undefined,
        isTyping: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response to database
      try {
        await saveChatMessage({
          user_id: user.id,
          role: 'assistant',
          content: actualResponse,
          thinking: thinking || undefined,
        });
      } catch (error) {
        console.error('Error saving AI response:', error);
      }

      // Start typewriter effect
      setTimeout(() => {
        typewriterEffect(actualResponse, messageIndex, thinking);
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorText = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorText}\n\nPlease check:\n1. Your Perplexity API key is correctly set in .env.local\n2. The development server was restarted after adding the key\n3. Check the console for detailed error messages`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-3xl mx-auto w-full">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3 text-muted-foreground">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading chat history...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl px-4">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold mb-3">What can I help you with?</h1>
              <p className="text-muted-foreground mb-8">
                Ask me anything about farming, crops, satellite data, weather, or agricultural best practices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    disabled={isLoading}
                    className="text-left p-4 rounded-xl border hover:border-green-600 hover:bg-muted/50 transition-all text-sm group"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-muted-foreground group-hover:text-green-600 transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-foreground">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-muted' 
                      : 'bg-green-600'
                  }`}>
                    {message.role === 'user' ? (
                      <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 overflow-hidden">
                    {message.role === 'user' ? (
                      <div>
                        <div className="text-sm font-medium mb-1 text-muted-foreground">You</div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                          AgriAI
                          {message.thinking && (
                            <button
                              onClick={() => toggleThinking(index)}
                              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              {expandedThinking.has(index) ? 'Hide' : 'Show'} thinking
                            </button>
                          )}
                        </div>
                        
                        {/* Thinking Section */}
                        {message.thinking && expandedThinking.has(index) && (
                          <div className="mb-4 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                            <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-wrap italic">
                              {message.thinking}
                            </p>
                          </div>
                        )}
                        
                        {/* Response Content */}
                        {message.isTyping && message.content === '' ? (
                          <div className="flex items-center gap-2 text-muted-foreground py-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        components={{
                          // Customize code blocks
                          code: ({ node, inline, className, children, ...props }: any) => {
                            if (inline) {
                              return (
                                <code className="bg-muted-foreground/20 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <code className="block bg-muted-foreground/10 p-3 rounded-md text-xs font-mono overflow-x-auto" {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Customize links
                          a: ({ node, children, ...props }: any) => (
                            <a className="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer" {...props}>
                              {children}
                            </a>
                          ),
                          // Customize headings
                          h1: ({ node, children, ...props }: any) => (
                            <h1 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h1>
                          ),
                          h2: ({ node, children, ...props }: any) => (
                            <h2 className="text-base font-bold mt-3 mb-2" {...props}>{children}</h2>
                          ),
                          h3: ({ node, children, ...props }: any) => (
                            <h3 className="text-sm font-bold mt-2 mb-1" {...props}>{children}</h3>
                          ),
                          // Customize lists
                          ul: ({ node, children, ...props }: any) => (
                            <ul className="list-disc list-inside space-y-1 my-2" {...props}>{children}</ul>
                          ),
                          ol: ({ node, children, ...props }: any) => (
                            <ol className="list-decimal list-inside space-y-1 my-2" {...props}>{children}</ol>
                          ),
                          // Customize tables
                          table: ({ node, children, ...props }: any) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full divide-y divide-border" {...props}>{children}</table>
                            </div>
                          ),
                          th: ({ node, children, ...props }: any) => (
                            <th className="px-3 py-2 text-left text-xs font-semibold bg-muted" {...props}>{children}</th>
                          ),
                          td: ({ node, children, ...props }: any) => (
                            <td className="px-3 py-2 text-xs border-t" {...props}>{children}</td>
                          ),
                          // Customize blockquotes
                          blockquote: ({ node, children, ...props }: any) => (
                            <blockquote className="border-l-4 border-green-600 pl-4 italic my-2" {...props}>
                              {children}
                            </blockquote>
                          ),
                          // Customize paragraphs
                          p: ({ node, children, ...props }: any) => (
                            <p className="my-2 leading-relaxed" {...props}>{children}</p>
                          ),
                        }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && messages.length === 0 && (
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2 text-muted-foreground">AgriAI</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-background">
        <div className="flex items-end gap-3 max-w-3xl mx-auto w-full">
          <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isLoadingHistory ? "Loading history..." : "Ask anything..."}
                disabled={isLoading || isLoadingHistory}
                className="w-full px-4 py-3 pr-12 bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isLoadingHistory}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

