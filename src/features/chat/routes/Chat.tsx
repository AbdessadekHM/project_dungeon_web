import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { chatApi, type ChatMessage } from '../api';
import { projectApi } from '@/features/projects/api';
import type { User } from '@/features/projects/types';
import { Send, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export function Chat() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, tokens } = useAuthStore();
  const { selectedProject } = useAppStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load message history & users
  useEffect(() => {
    if (!projectId) return;
    
    chatApi.getMessages(projectId).then(setMessages).catch(console.error);

    if (selectedProject) {
      projectApi.getUsers().then(allUsers => {
        const projectUserIds = new Set([
          selectedProject.owner,
          ...(selectedProject.collaborators || []),
        ]);
        
        const validUsers = allUsers.filter(u => projectUserIds.has(u.id));
        setProjectUsers(validUsers);
      }).catch(console.error);
    }
  }, [projectId, selectedProject]);

  // Open WebSocket
  useEffect(() => {
    if (!projectId || !tokens?.access) return;

    const ws = new WebSocket(`${WS_BASE}/ws/chat/${projectId}/?token=${tokens.access}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          project: Number(projectId),
          sender: msg.sender_id,
          sender_username: msg.sender,
          content: msg.content,
          created_at: msg.created_at,
        },
      ]);
    };

    return () => {
      ws.close();
    };
  }, [projectId, tokens?.access]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ content: trimmed }));
    setInput('');
    setShowMentions(false);
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPosition);
    
    const match = textBeforeCursor.match(/@(\w*)$/);
    
    if (match) {
      setShowMentions(true);
      setMentionQuery(match[1].toLowerCase());
      setMentionIndex(0);
    } else {
      setShowMentions(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!showMentions) return [];
    return projectUsers
      .filter(u => u.username.toLowerCase().includes(mentionQuery));
  }, [projectUsers, showMentions, mentionQuery]);

  const insertMention = (username: string) => {
    if (!inputRef.current) return;
    
    const cursorPosition = inputRef.current.selectionStart || 0;
    const textBeforeCursor = input.slice(0, cursorPosition);
    const textAfterCursor = input.slice(cursorPosition);
    
    const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@${username} `);
    
    setInput(newTextBefore + textAfterCursor);
    setShowMentions(false);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(prev => {
          const next = (prev + 1) % filteredUsers.length;
          document.getElementById(`mention-item-${next}`)?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(prev => {
          const next = (prev - 1 + filteredUsers.length) % filteredUsers.length;
          document.getElementById(`mention-item-${next}`)?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredUsers[mentionIndex].username);
        return;
      }
      if (e.key === 'Escape') {
        setShowMentions(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const date = formatDate(msg.created_at);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date, msgs: [msg] });
    }
  }

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const isMe = part.toLowerCase() === `@${user?.username?.toLowerCase()}`;
        return (
          <span 
            key={i} 
            className={cn(
              "font-medium px-1 rounded-sm mx-0.5",
              isMe ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-blue-700/20 text-blue-700"
            )}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-[14px] font-semibold text-foreground">
            {selectedProject?.title ?? 'Project'} — Chat
          </h2>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full inline-block',
                isConnected ? 'bg-emerald-500' : 'bg-muted-foreground'
              )}
            />
            {isConnected ? 'Connected' : 'Connecting...'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-20" />
            <p className="text-[13px]">No messages yet — start the conversation!</p>
          </div>
        )}

        {groupedMessages.map(({ date, msgs }) => (
          <div key={date} className="space-y-3">
            {/* Date divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground px-2">{date}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {msgs.map((msg) => {
              const isOwn = msg.sender === user?.id;
              const initials = msg.sender_username.substring(0, 2).toUpperCase();
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-end gap-2.5 group',
                    isOwn ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="h-7 w-7 shrink-0 border border-border">
                    <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn('flex flex-col gap-0.5 max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
                    {!isOwn && (
                      <span className="text-[11px] font-medium text-muted-foreground px-1">
                        {msg.sender_username}
                      </span>
                    )}
                    <div
                      className={cn(
                        'px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap',
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      )}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-6 py-4 border-t border-border bg-card/60 backdrop-blur-sm relative">
        
        {/* Mention Dropdown */}
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute bottom-full left-6 mb-2 w-64 bg-popover border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border/50">
              Mention a collaborator
            </div>
            <div className="py-1 max-h-[240px] overflow-y-auto">
              {filteredUsers.map((u, i) => (
                <button
                  key={u.id}
                  id={`mention-item-${i}`}
                  onClick={() => insertMention(u.username)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                    i === mentionIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-foreground"
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[9px] bg-primary/20 text-primary">
                      {u.username.substring(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium leading-none">{u.username}</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Use @ to mention people, Enter to send)"
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className={cn(
              'h-8 w-8 rounded-lg shrink-0 transition-all duration-200',
              'bg-primary hover:brightness-110 disabled:opacity-40'
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
