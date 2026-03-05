import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { chatApi, type ChatMessage } from '../api';
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
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load message history on mount
  useEffect(() => {
    if (!projectId) return;
    chatApi.getMessages(projectId).then(setMessages).catch(console.error);
  }, [projectId]);

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
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col h-full bg-background">
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
                        'px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed wrap-break-word',
                        isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      )}
                    >
                      {msg.content}
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
      <div className="shrink-0 px-6 py-4 border-t border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
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
