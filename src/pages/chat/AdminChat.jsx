const scrollbarStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X, Trash2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from "@/instances/axiosInstance";
import useAuthStore from "@/store/authStore";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

export default function EnhancedFixedChatWindow({ isOpen, onClose }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showEndedAlert, setShowEndedAlert] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const { user } = useAuthStore();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const formatTime = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) {
      return "";
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getFirstName = (fullName) => fullName?.split(" ")[0] || "Usuario";

  const fetchMessages = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const response = await axiosInstance("/messages");
      const fetchedMessages = response.data;

      const organizedMessages = fetchedMessages.reduce((acc, msg) => {
        const key =
          user.uid === ADMIN_UID
            ? msg.isAdmin
              ? msg.recipient
              : msg.sender
            : ADMIN_UID;

        if (!acc[key]) acc[key] = [];
        acc[key].push({
          ...msg,
          timestamp: new Date(msg.timestamp).getTime(),
        });
        return acc;
      }, {});

      setMessages(organizedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user]);

  const initializeSocket = useCallback(() => {
    if (!user?.uid) return;
    const newSocket = io(
      "https://reffinato-backend-production.up.railway.app/",
      {
        transports: ["websocket"],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      }
    );

    newSocket.on("connect", () => {
      if (user.uid === ADMIN_UID) {
        newSocket.emit("admin login", ADMIN_UID);
        setAdminOnline(true);
      } else {
        newSocket.emit("user login", user.displayName);
        newSocket.emit("check admin status");
      }
    });

    newSocket.on("admin status", (status) => {
      setAdminOnline(status);
    });

    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => {
        const key =
          user.uid === ADMIN_UID
            ? msg.isAdmin
              ? msg.recipient
              : msg.sender
            : ADMIN_UID;

        const updatedMessages = {
          ...prevMessages,
          [key]: [
            ...(prevMessages[key] || []),
            {
              ...msg,
              timestamp: new Date().getTime(),
            },
          ],
        };
        return updatedMessages;
      });

      if (
        user.uid === ADMIN_UID &&
        !users.includes(msg.sender) &&
        msg.sender !== ADMIN_UID
      ) {
        setUsers((prevUsers) => [...new Set([...prevUsers, msg.sender])]);
      }
      scrollToBottom();
    });

    newSocket.on("user list", (userList) => {
      setUsers(userList.filter((u) => u !== ADMIN_UID));
    });

    newSocket.on("conversation ended", (endedUser) => {
      if (user.uid === ADMIN_UID) {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          delete newMessages[endedUser];
          return newMessages;
        });
        setUsers((prevUsers) => prevUsers.filter((u) => u !== endedUser));
        setSelectedUser(null);
      } else {
        setShowEndedAlert(true);
      }
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const cleanup = initializeSocket();
      return cleanup;
    }
  }, [isOpen, initializeSocket, fetchMessages]);

  const sendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!inputMessage.trim() || !socketRef.current) return;

      const messageObj = {
        sender: user.uid === ADMIN_UID ? ADMIN_UID : user.displayName,
        content: inputMessage.trim(),
        isAdmin: user.uid === ADMIN_UID,
        recipient: user.uid === ADMIN_UID ? selectedUser : ADMIN_UID,
        timestamp: Date.now(), // Cambiado a Date.now() para asegurar un timestamp válido
      };

      socketRef.current.emit("chat message", messageObj, (error) => {
        if (error) {
          console.error("Error sending message:", error);
          return;
        }

        setInputMessage("");
        setMessages((prevMessages) => {
          const key = user.uid === ADMIN_UID ? selectedUser : ADMIN_UID;
          return {
            ...prevMessages,
            [key]: [...(prevMessages[key] || []), messageObj],
          };
        });
        scrollToBottom();
      });
    },
    [inputMessage, user, selectedUser]
  );

  const endConversation = useCallback(() => {
    if (socketRef.current && selectedUser) {
      socketRef.current.emit("end conversation", selectedUser);
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[selectedUser];
        return newMessages;
      });
      setUsers((prevUsers) => prevUsers.filter((u) => u !== selectedUser));
      setSelectedUser(null);
    }
  }, [selectedUser]);

  const deleteConversation = useCallback(() => {
    if (selectedUser) {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[selectedUser];
        return newMessages;
      });
      setSelectedUser(null);
    }
  }, [selectedUser]);

  const renderMessages = () => {
    const currentUserMessages =
      user.uid === ADMIN_UID
        ? selectedUser
          ? messages[selectedUser] || []
          : []
        : messages[ADMIN_UID] || [];

    return (
      <div className="flex flex-col space-y-4">
        {currentUserMessages.map((msg, index) => {
          // Corregido: Un mensaje es del usuario actual si:
          // - Para usuarios normales: el mensaje NO es del admin
          // - Para el admin: el mensaje SÍ es del admin
          const isFromCurrentUser =
            user.uid === ADMIN_UID ? msg.isAdmin : !msg.isAdmin;

          return (
            <div
              key={index}
              className={`flex w-full ${
                isFromCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  isFromCurrentUser ? "items-end" : "items-start"
                } max-w-[80%]`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isFromCurrentUser
                      ? "bg-[#a0501a] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    hyphens: "auto",
                    maxWidth: "100%",
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.timestamp && (
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = scrollbarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isOpen || !user?.uid) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[450px] flex flex-col overflow-hidden z-50 shadow-lg">
      <CardHeader className="p-3 flex-shrink-0 flex justify-between items-center bg-gray-50 border-b">
        <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
          {user.uid === ADMIN_UID ? (
            selectedUser ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    {getFirstName(selectedUser)[0].toUpperCase()}
                  </div>
                  <span>Chat with {getFirstName(selectedUser)}</span>
                </div>
              </>
            ) : (
              "Select a user to chat"
            )
          ) : (
            <>
              <span
                className={`w-2 h-2 rounded-full ${
                  adminOnline ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {adminOnline ? "Live Support" : "Support Offline"}
            </>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          {user.uid === ADMIN_UID && selectedUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={deleteConversation}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={endConversation}
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="End conversation"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4 bg-white scrollbar-hide">
        {showEndedAlert ? (
          <Alert variant="destructive">
            <AlertTitle>Chat Ended</AlertTitle>
            <AlertDescription>
              The conversation has ended. Please start a new chat if you need
              further assistance.
            </AlertDescription>
          </Alert>
        ) : user.uid === ADMIN_UID && !selectedUser ? (
          <div className="grid gap-2">
            {users.map((username) => (
              <Button
                key={username}
                onClick={() => setSelectedUser(username)}
                variant="outline"
                className="justify-start"
              >
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="ml-2">{getFirstName(username)}</span>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          renderMessages()
        )}
      </CardContent>

      {!showEndedAlert && (user.uid !== ADMIN_UID || selectedUser) && (
        <CardFooter className="p-2 bg-gray-50">
          <form onSubmit={sendMessage} className="flex w-full gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit" variant="ghost" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
