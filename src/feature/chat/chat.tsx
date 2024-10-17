import React, { useCallback, useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Input } from 'antd';
import { ChatPrivilege } from '@zoom/videosdk';
import ZoomContext from '../../context/zoom-context';
import ChatMessageItem from './component/chat-message-item';
import ChatReceiverContainer from './component/chat-receiver';
import { useChat } from './hooks/useChat';
import './chat.scss';

const { TextArea } = Input;
interface ChatContainerProps {
  setIsChatWindowOpen: (state: boolean) => void;
  isChatWindowOpen: boolean;
}
const ChatContainer = ({ setIsChatWindowOpen, isChatWindowOpen }: ChatContainerProps) => {
  const zmClient = useContext(ZoomContext);
  const chatClient = zmClient.getChatClient();
  const [chatDraft, setChatDraft] = useState<string>('');
  const chatWrapRef = useRef<HTMLDivElement | null>(null);
  const {
    records,
    receivers,
    privilege,
    chatUser,
    isHostOrManager,
    setChatUserId,
    sendMessage,
    sendFile,
    resendFile,
    downloadFile
  } = useChat(zmClient, chatClient);

  const onChatInput = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatDraft(event.target.value);
  }, []);
  const onChatPressEnter = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
      if (chatUser && chatDraft) {
        sendMessage(chatDraft);
        setChatDraft('');
      }
    },
    [sendMessage, chatUser, chatDraft]
  );
  useLayoutEffect(() => {
    if (chatWrapRef.current) {
      chatWrapRef.current.scrollTo(0, chatWrapRef.current.scrollHeight);
    }
  }, [records]);
  console.log(chatClient.getHistory(), 'recordddsss');
  return (
    <div className="chat-container">
      <div className="chat-wrap">
        <h2
          onClick={() => {
            setIsChatWindowOpen(!isChatWindowOpen);
          }}
        >
          Chat
        </h2>
        <div className="chat-message-wrap" ref={chatWrapRef}>
          {chatClient.getHistory().map((record) => (
            <ChatMessageItem
              record={record}
              currentUserId={zmClient.getSessionInfo().userId}
              setChatUser={setChatUserId}
              key={record.timestamp}
              resendFile={resendFile}
              downloadFile={downloadFile}
            />
          ))}
        </div>
        {ChatPrivilege.NoOne !== privilege || isHostOrManager ? (
          <>
            <ChatReceiverContainer
              chatUsers={receivers}
              selectedChatUser={chatUser}
              isHostOrManager={isHostOrManager}
              chatPrivilege={privilege}
              setChatUser={setChatUserId}
              sendFile={sendFile}
            />
            <div className="chat-message-box">
              <TextArea
                onPressEnter={onChatPressEnter}
                onChange={onChatInput}
                value={chatDraft}
                placeholder="Type message here ..."
              />
            </div>
          </>
        ) : (
          <div className="chat-disabled">Chat disabled</div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
