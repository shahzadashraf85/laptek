'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

const QUICK_REPLIES = [
    "Track my order",
    "Return policy",
    "Product recommendations",
    "Speak to agent"
];

export function LiveChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi! 👋 I'm your LapTek assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now() + 1,
                text: `Thanks for your message! A support agent will assist you shortly. In the meantime, you can browse our products or check our FAQ.`,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
            </Button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-80' : 'w-96'}`}>
            <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${isMinimized ? 'h-16' : 'h-[600px]'} flex flex-col`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold">LapTek Support</h3>
                            <p className="text-xs opacity-90">Online • Avg response: 2 min</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Replies */}
                        <div className="px-4 py-2 bg-white border-t flex gap-2 overflow-x-auto">
                            {QUICK_REPLIES.map((reply, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(reply)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => sendMessage(input)}
                                    size="icon"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
