import React, { useEffect, useRef, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, otherUserId, otherUserName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Query for messages between the two users
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUserId),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include messages between these two users
        if (
          (data.senderId === currentUserId && data.receiverId === otherUserId) ||
          (data.senderId === otherUserId && data.receiverId === currentUserId)
        ) {
          msgs.push({ id: doc.id, ...data } as Message);
        }
      });
      setMessages(msgs);
      setLoading(false);
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: currentUserId,
        receiverId: otherUserId,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        participants: [currentUserId, otherUserId],
      });
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg bg-white shadow-md">
      <div className="p-3 border-b font-semibold text-lg">Chat with {otherUserName}</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {loading ? (
          <div>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words text-sm shadow
                  ${msg.senderId === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
              >
                {msg.text}
                <div className="text-xs text-right mt-1 opacity-60">
                  {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString() : ''}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading || !newMessage.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;