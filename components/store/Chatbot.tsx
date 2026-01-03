'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hi! I can help you find the best laptop or check Amazon availability. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');

    const toggle = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        // Type assertion for role to satisfy TS if needed, or just let inference work
        setMessages(prev => [...prev, { role: 'user' as const, text: userMsg }]);
        setInput('');

        // Simulate N8N/AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot' as const, text: `I found a great deal on a MacBook Pro matching "${userMsg}". It's available on Amazon for $2499.` }]);
        }, 1500);
    };

    return (
        <>
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 bg-blue-600 hover:bg-blue-700"
                onClick={toggle}
            >
                {isOpen ? <X /> : <MessageCircle />}
            </Button>

            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] z-50 shadow-2xl flex flex-col overflow-hidden border-2 border-blue-100">
                    <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center">
                        <span>LapTek AI Assistant</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t bg-white flex gap-2">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about specs..."
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <Button size="icon" onClick={sendMessage}><Send className="h-4 w-4" /></Button>
                    </div>
                </Card>
            )}
        </>
    );
}
