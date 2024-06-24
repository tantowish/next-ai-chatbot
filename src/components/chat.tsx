'use client'

import { useChat, Message } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonalIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CopyToClipboard from "./copyToClipboard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"  
import Markdown from "react-markdown";
import { Textarea } from "./ui/textarea";


export const Chat = () => {
    const [model, setModel] = useState("chatgpt")
    const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
    const [initialContent, setInitialContent] = useState("Kamu adalah seorang asisten yang memberikan jawaban singkat menggunakan bahasa indonesia");
    const initialMessages: Message[] = [
        {
            id: Date.now().toString(),
            role: 'system',
            content: initialContent
        }
    ];
    const [chatConfig, setChatConfig] = useState({ initialMessages });

    
    const ref = useRef<HTMLDivElement>(null)
    const { messages, input, handleInputChange, isLoading, handleSubmit: originalHandleSubmit, error } = useChat(chatConfig);

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const modelValue = model;

        const data:Record<string, string> = {
            model: modelValue,
        };

        originalHandleSubmit(event, {data});
        setIsTextareaDisabled(true);
    };

    const handleModelChange = (value: string) => {
        console.log(value)
        setModel(value);
    };

    const handleInitialContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = event.target.value;
        setInitialContent(newContent);
        setChatConfig({ initialMessages: [{ id: Date.now().toString(), role: 'system', content: newContent }] });
        console.log(initialContent)
    };

    useEffect(() => {
        if(ref.current === null) return
        ref.current.scrollTo(0, ref.current.scrollHeight)
    }, [messages])
  return (
    <div className="text-zinc-700">
        <div className="p-4 lg:p-8 lg:h-screen">
            <div className="py-2 lg:px-4 lg:py-0 mb-4">
                <h1 className="text-left text-2xl font-bold">AI Chabot</h1>
                <p className="text-left text-xs">Created By <a href="https://github.com/tantowish" target="_blank">TANTOWS</a> powered by <a href="https://carigi.id" target="_blank">CARIGI INDONESIA</a></p>
            </div>
            <div className="flex flex-wrap mx-auto stretch h-full">
                <div className="w-full lg:w-1/2 lg:p-4 lg:h-3/4">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <p>Select model: </p>
                        <Select 
                        onValueChange={handleModelChange}
                        value={model}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="GPT-4" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="chatgpt">GPT-4</SelectItem>
                                <SelectItem value="gemini">Gemini-pro</SelectItem>
                                <SelectItem value="claude">Claude-3-5-sonnet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="lg:h-3/4">
                        <div className="flex flex-wrap justify-between items-center">
                            <p>Initial Message:</p>
                            <p className="text-xs">*reload to change</p>
                        </div>
                        <Textarea 
                            disabled={isTextareaDisabled}
                            onChange={handleInitialContentChange} 
                            value={initialContent}
                            className="mb-4 h-full"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2 lg:p-4 lg:h-3/4">
                    <ScrollArea className="lg:h-full h-96 mb-2 rounded-md border p-3 md:p-4"
                    ref={ref}>
                        {error && (
                            <div className="text-sm text-red-400">{error.message}</div>
                        )}
                        {messages.map(m => (
                            <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
                            {m.role === 'user' && (
                                <div className="mb-6 flex gap-2 md:gap-3">
                                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                        <AvatarImage src=""/>
                                        <AvatarFallback>us</AvatarFallback>
                                    </Avatar>
                                    <div className="mt-1.5">
                                        <p className="font-semibold text-sm md:text-base">You</p>
                                        <div className="mt-1.5 text-sm text-zinc-500 text-justify">{m.content}</div>
                                    </div>
                                </div>
                            )}
                            {m.role === 'assistant' && (
                                <div className="mb-6 flex gap-2 md:gap-3">
                                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                        <AvatarFallback className="bg-emerald-500 text-white">AI</AvatarFallback>
                                    </Avatar>
                                    <div className="mt-1.5 w-full">
                                        <div className="flex justify-between">
                                            <p className="font-semibold text-sm md:text-base">Bot</p>
                                            <CopyToClipboard message={m} />
                                        </div>
                                        <div className="mt-1.5 text-sm text-zinc-500 text-justify">{m.content}</div>
                                    </div>
                                </div>
                            )}
                            </div>
                        ))}
                    </ScrollArea>
                    {/* Input */}
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            className="w-full border border-1 rounded-md p-4 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500"
                            value={input}
                            placeholder="Send message..."
                            onChange={handleInputChange}
                        />

                        <Button
                            size='icon'
                            type='submit'
                            variant='secondary'
                            disabled={isLoading}
                            className='absolute right-1 bottom-3 h-8 w-10'
                        >
                            <SendHorizonalIcon className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>  
        </div>
    </div>
    )
}
