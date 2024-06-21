'use client'

import { useChat } from "ai/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CopyIcon, SendHorizonalIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CopyToClipboard from "./copyToClipboard";

export const Chat = () => {
    const ref = useRef<HTMLDivElement>(null)
    const { messages, input, handleInputChange, isLoading, handleSubmit, error } = useChat({
        // initialMessages: [
        //     {
        //         id: Date.now().toString(),
        //         role: 'system',
        //         content: 'Kamu adalah seorang asisten yang memberikan jawaban singkat menggunakan bahasa indonesia'
        //     }
        // ]
    });

    useEffect(() => {
        if(ref.current === null) return
        ref.current.scrollTo(0, ref.current.scrollHeight)
    }, [messages])
  return (
    <div className="text-zinc-700">
        <div className="container">
            <div className="flex flex-col w-full max-w-md md:max-w-xl py-24 mx-auto stretch h-screen">
                <div className="mb-4">
                    <h1 className="text-center text-2xl">AI Chabot</h1>
                    <p className="text-center text-xs">Created By <a href="https://github.com/tantowish" target="_blank">TOSHKA POLKA</a></p>
                </div>

                <ScrollArea className="mb-2 h-3/4 rounded-md border p-4"
                ref={ref}>
                    {error && (
                        <div className="text-sm text-red-400">{error.message}</div>
                    )}
                    {messages.map(m => (
                        <div key={1} className="mr-6 whitespace-pre-wrap md:mr-12">
                        {m.role === 'user' && (
                            <div className="mb-6 flex gap-3">
                                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                    <AvatarImage src=""/>
                                    <AvatarFallback>us</AvatarFallback>
                                </Avatar>
                                <div className="mt-1.5">
                                    <p className="font-semibold text-sm md:text-base">You</p>
                                    <div className="mt-1.5 text-sm text-zinc-500">{m.content}</div>
                                </div>
                            </div>
                        )}
                        {m.role === 'assistant' && (
                            <div className="mb-6 flex gap-3">
                                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                    <AvatarFallback className="bg-emerald-500 text-white">AI</AvatarFallback>
                                </Avatar>
                                <div className="mt-1.5 w-full">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-sm md:text-base">Bot</p>
                                        <CopyToClipboard message={m} />
                                    </div>
                                    <div className="mt-1.5 text-sm text-zinc-500">{m.content}</div>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                </ScrollArea>
                {/* Input */}
                <form onSubmit={handleSubmit} className="relative">
                    <Input
                        className="pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500"
                        value={input}
                        placeholder="Ask me anything"
                        onChange={handleInputChange}
                    />

                    <Button
                        size='icon'
                        type='submit'
                        variant='secondary'
                        disabled={isLoading}
                        className='absolute right-1 top-1 h-8 w-10'
                    >
                        <SendHorizonalIcon className="h-4 w-4" />
                    </Button>
                </form>
            </div>  
        </div>
    </div>
    )
}
