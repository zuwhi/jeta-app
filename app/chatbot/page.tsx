"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import ButtonBack from "../global_component/button_back";

interface Chat {
  input: string;
  output: string;
}

// Function to format the output text
const formatOutput = (text: string): string => {
  // Replace *text* with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
};

function ChatbotPage() {
  const [input, setInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([{ input: "", output: "Selamat datang di Asisten Aplikasi JETA! Ada yang bisa saya bantu?" }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const perintah =
      //   "posisikan kamu adalah bot aplikasi jeta, aplikasi jeta adalah aplikasi untuk melacak transportasi umum seperti angkutan dan bus secara real tim.  jika pertanyaan pengguna tidak sesuai dengan tema aplikasi tolong jawab sesuai dengan tema, ini pertanya pengguna =";

      const perintah = "posisikan kamu adalah bot aplikasi jeta, aplikasi jeta adalah aplikasi untuk melacak transportasi umum seperti angkutan dan bus secara real tim.  ini pertanya pengguna =";

      const response = await fetch(`https://api.nyxs.pw/ai/gemini?text=${perintah} ${input}`);
      const data = await response.json();

      setChatHistory([...chatHistory, { input, output: formatOutput(data.result) }]);
      setInput("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className=" text-gray-100 h-[90vh] flex flex-col dark:bg-gray-200 dark:text-gray-50  pb-4">
      <ButtonBack />
      <div className="flex-1 overflow-y-auto px-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-4">
            {chat.input && (
              <div className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <Image src="icons/avatar.svg" width={500} height={500} alt="Logo" />
                  </div>
                </div>
                <div className="chat-bubble text-white chat-bubble-info">{chat.input}</div>
              </div>
            )}

            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <Image src="icons/avatar.svg" width={500} height={500} alt="Logo" />
                </div>
              </div>
              <div className="chat-bubble text-white primary" dangerouslySetInnerHTML={{ __html: chat.output }}></div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center px-4">
        <input type="text" className="w-full text-dark border rounded-lg py-2 px-4" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
        <button type="submit" className="primary rounded-lg px-4 py-2 ml-2" disabled={isLoading}>
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatbotPage;
