"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChatDashboard from "@/components/chat/ChatDashboard";
import ChatList from "@/components/chat/ChatList";
import ChatPage from "@/components/chat/ChatPage";
import MessageItem from "@/components/chat/MessageItem";
import MessageInput from "@/components/chat/MessageInput";

const ChatDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <ChatDashboard>
      <ChatPage chatId={id}>
        <div className="messages">
          <MessageItem
            message={{
              id: "msg1",
              sender: "user",
              content: "Salom!",
              timestamp: new Date().toISOString(),
            }}
          />
        </div>
        <MessageInput chatId={id} />
      </ChatPage>
    </ChatDashboard>
  );
};

export default ChatDetailPage;
