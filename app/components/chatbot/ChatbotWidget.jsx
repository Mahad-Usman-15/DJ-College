'use client';

import { useState } from 'react';
import ChatbotTrigger from './ChatbotTrigger';
import ChatbotWindow from './ChatbotWindow';
import ChatbotHeader from './ChatbotHeader';
import ChatbotMessages from './ChatbotMessages';
import SuggestedQuestions from './SuggestedQuestions';
import ChatbotInput from './ChatbotInput';
import { useChatbot } from './useChatbot';

/**
 * ChatbotWidget - Main container component
 * Composes all chatbot sub-components
 * Per spec: Provides complete chatbot widget UI with:
 * - Floating trigger button (bottom-right, fixed)
 * - Animated chat window
 * - Header with title, status, close/clear buttons
 * - Welcome message and suggested questions
 * - Message area with markdown support
 * - Input area with auto-resizing textarea
 */
export default function ChatbotWidget() {
  const {
    isOpen,
    messages,
    isTyping,
    isStreaming,
    toggle,
    close,
    clearConversation,
    sendMessage,
    suggestedQuestions
  } = useChatbot();
  
  const [inputValue, setInputValue] = useState('');

  const handleQuestionSelect = (question) => {
    sendMessage(question.text);
    setInputValue('');
  };

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  const showWelcome = messages.length === 1 && messages[0].id === 'welcome';

  return (
    <>
      <ChatbotTrigger onClick={toggle} isOpen={isOpen} />
      
      <ChatbotWindow isOpen={isOpen} onClose={close}>
        <ChatbotHeader
          title="DJ College Assistant"
          status={isTyping ? 'typing' : 'online'}
          onClose={close}
          onClear={clearConversation}
        />
        
        <ChatbotMessages messages={messages} isTyping={isTyping} />
        
        {showWelcome && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleQuestionSelect}
          />
        )}
        
        <ChatbotInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isDisabled={isTyping || isStreaming}
        />
      </ChatbotWindow>
    </>
  );
}
