'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Send,
    MoreVertical,
    Phone,
    Video,
    Smile
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const CONVERSATIONS = [
    {
        id: 1,
        user: { name: 'John Doe', avatar: '', status: 'online' },
        lastMessage: 'I have a question about the MacBook Pro specs.',
        time: '2m ago',
        unread: 1,
        messages: [
            { id: 1, sender: 'user', text: 'Hi, I need help.', time: '10:00 AM' },
            { id: 2, sender: 'agent', text: 'Hello! How can I assist you today?', time: '10:01 AM' },
            { id: 3, sender: 'user', text: 'I have a question about the MacBook Pro specs.', time: '10:02 AM' },
        ]
    },
    {
        id: 2,
        user: { name: 'Sarah Smith', avatar: 'https://github.com/shadcn.png', status: 'offline' },
        lastMessage: 'Thanks for your help!',
        time: '1h ago',
        unread: 0,
        messages: [
            { id: 1, sender: 'user', text: 'Where is my order?', time: '09:00 AM' },
            { id: 2, sender: 'agent', text: 'It is out for delivery.', time: '09:05 AM' },
            { id: 3, sender: 'user', text: 'Thanks for your help!', time: '09:06 AM' },
        ]
    },
    {
        id: 3,
        user: { name: 'Mike Johnson', avatar: '', status: 'online' },
        lastMessage: 'Is this item in stock?',
        time: '3h ago',
        unread: 0,
        messages: []
    }
];

export default function InboxPage() {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [inputMessage, setInputMessage] = useState('');
    const [chats, setChats] = useState(CONVERSATIONS);

    const activeChat = chats.find(c => c.id === selectedChat);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !selectedChat) return;

        const updatedChats = chats.map(chat => {
            if (chat.id === selectedChat) {
                return {
                    ...chat,
                    messages: [
                        ...chat.messages,
                        { id: Date.now(), sender: 'agent', text: inputMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                    ],
                    lastMessage: `You: ${inputMessage}`,
                    time: 'Just now'
                };
            }
            return chat;
        });

        setChats(updatedChats as any);
        setInputMessage('');
    };

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Sidebar */}
            <Card className="w-1/3 flex flex-col overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-xl mb-4">Inbox</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search messages..." className="pl-9" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={chat.user.avatar} />
                                            <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {chat.user.status === 'online' && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{chat.user.name}</h3>
                                        <p className="text-xs text-gray-500 truncate max-w-[140px]">{chat.lastMessage}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs text-gray-400">{chat.time}</span>
                                    {chat.unread > 0 && (
                                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600">
                                            {chat.unread}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={activeChat.user.avatar} />
                                    <AvatarFallback>{activeChat.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold">{activeChat.user.name}</h2>
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {activeChat.messages.map((msg: any) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${msg.sender === 'agent' ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div
                                            className={`p-3 rounded-2xl ${msg.sender === 'agent'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white border rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t">
                            <div className="flex gap-2 items-center">
                                <Button variant="ghost" size="icon">
                                    <Smile className="w-5 h-5 text-gray-500" />
                                </Button>
                                <Input
                                    placeholder="Type your message..."
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1"
                                />
                                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()} className="bg-blue-600 hover:bg-blue-700">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
