import React, { useState, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';
import { getRandomDelay } from '../../lib/utils';


const ChatView = () => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('chat_messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (content, type = 'text') => {
        if (!content && type === 'text') return;
        const userMsg = { sender: 'user', content, type };
        setMessages((prev) => [...prev, userMsg]);
        setIsThinking(true);
        setInput('')

        setTimeout(() => {
            const botResponse = {
                sender: 'bot',
                content: faker.hacker.phrase(),
                type: 'text',
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsThinking(false);
        }, getRandomDelay());
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            handleSend(reader.result, 'image');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="w-full max-w-xl mx-auto h-screen flex flex-col border border-gray-300 rounded shadow px-4 pb-4">
            <div className='my-4 bg-blue-400 py-3 font-medium text-white'>🤖 Chat Bot</div>
            <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`rounded-lg p-2 max-w-xs break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                }`}
                        >
                            {msg.type === 'text' ? (
                                msg.content
                            ) : (
                                <img src={msg.content} alt="uploaded" className="max-w-[200px] rounded" />
                            )}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="!ml-2 px-4 flex items-center gap-3 rounded-lg bg-gray-100" data-title="dot-typing">
                           <span>Bot đang thinking</span>
                            <div className="flex items-center justify-center px-3 py-3 stage">
                                <div className="dot-typing"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef}></div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded"
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                />
                <button
                    onClick={() => handleSend(input)}
                    className="!bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Gửi
                </button>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-300 text-black px-3 py-2 rounded"
                >
                    📷
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"    
                    hidden
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    );
};

export default ChatView;
