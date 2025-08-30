import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, HelpCircle } from 'lucide-react';

type DisasterPhase = 'before' | 'during' | 'after';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  phase: DisasterPhase;
}

interface EmergencyChatbotProps {
  currentPhase: DisasterPhase;
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const EmergencyChatbot: React.FC<EmergencyChatbotProps> = ({
  currentPhase,
  emergencyLevel,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      message: getWelcomeMessage(),
      timestamp: new Date(),
      phase: currentPhase,
    };
    setMessages([welcomeMessage]);
  }, [currentPhase]);

  const getWelcomeMessage = () => {
    switch (currentPhase) {
      case 'before':
        return `Hello! I'm here to help you prepare for emergencies. You can ask me about evacuation plans, emergency kits, or safety procedures. Current emergency level: ${emergencyLevel}. What would you like to know?`;
      case 'during':
        return `🚨 Emergency assistance active. I'm here to help you stay safe during this emergency. Ask me about evacuation routes, shelter locations, or safety procedures. Stay calm and follow official instructions.`;
      case 'after':
        return `I'm here to help with recovery and rebuilding. You can ask about damage assessment, insurance claims, aid resources, or community support. How can I assist you today?`;
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    // Emergency-specific responses based on phase
    if (currentPhase === 'before') {
      if (lowercaseMessage.includes('evacuat') || lowercaseMessage.includes('route')) {
        return "For evacuation planning:\n1. Know at least 2 routes to safety\n2. Check the Evacuation Routes tab for real-time updates\n3. Practice your route with family\n4. Keep car fueled and ready\n\nWould you like me to show you the nearest shelters?";
      }
      if (lowercaseMessage.includes('emergency kit') || lowercaseMessage.includes('supplies')) {
        return "Essential emergency kit items:\n• Water: 1 gallon per person per day (3-day supply)\n• Non-perishable food (3-day supply)\n• Flashlight and batteries\n• First aid kit\n• Medications\n• Important documents\n• Cash\n• Phone chargers\n\nCheck the Emergency Checklist tab for a complete list!";
      }
      if (lowercaseMessage.includes('family') || lowercaseMessage.includes('communication')) {
        return "Family emergency communication plan:\n1. Choose an out-of-state contact person\n2. Identify meeting places (near home and outside neighborhood)\n3. Ensure everyone knows the plan\n4. Keep emergency contact cards in wallets\n5. Practice the plan regularly\n\nMake sure all family members know how to use this emergency app!";
      }
    }

    if (currentPhase === 'during') {
      if (lowercaseMessage.includes('safe') || lowercaseMessage.includes('where')) {
        return "🚨 For immediate safety:\n1. Move to higher ground if flooding\n2. Stay indoors unless ordered to evacuate\n3. Check the Map tab for nearest safe locations\n4. Follow official evacuation orders\n5. Use the SOS button if in immediate danger\n\nYour safety is the priority. Are you in a safe location right now?";
      }
      if (lowercaseMessage.includes('sos') || lowercaseMessage.includes('help') || lowercaseMessage.includes('emergency')) {
        return "🆘 For immediate emergency help:\n• Use the red SOS button (sends location + call for help)\n• Call emergency services: 113 (Police), 114 (Fire), 115 (Medical)\n• Stay calm and provide clear information\n• Give your exact location\n\nIf you can't call, the SOS button will send your GPS location automatically.";
      }
      if (lowercaseMessage.includes('shelter') || lowercaseMessage.includes('evacuat')) {
        return "🏠 Evacuation and shelter info:\n• Check the Routes tab for real-time evacuation routes\n• Da Nang Community Center: 350 spaces available\n• Hai Chau Sports Complex: 200 spaces available\n• Follow traffic control officer instructions\n• Bring essential items only\n\nDo you need directions to the nearest shelter?";
      }
    }

    if (currentPhase === 'after') {
      if (lowercaseMessage.includes('damage') || lowercaseMessage.includes('insurance')) {
        return "📋 For damage assessment and insurance:\n1. Document all damage with photos\n2. Keep receipts for emergency expenses\n3. Contact your insurance company\n4. Don't throw away damaged items until documented\n5. Get written estimates for repairs\n\nThe app can help you organize damage photos and reports.";
      }
      if (lowercaseMessage.includes('aid') || lowercaseMessage.includes('help') || lowercaseMessage.includes('support')) {
        return "🤝 Recovery aid and support:\n• Aid distribution points are marked on the map\n• Medical assistance at emergency hospitals\n• Financial aid applications available\n• Community volunteer support\n• Mental health resources\n\nWould you like me to locate the nearest aid distribution point?";
      }
      if (lowercaseMessage.includes('community') || lowercaseMessage.includes('volunteer')) {
        return "👥 Community support and volunteering:\n• Join recovery volunteer groups\n• Check on elderly neighbors\n• Share resources with community\n• Report recovery needs\n• Help with cleanup efforts\n\nCommunity cooperation speeds up recovery. How would you like to help?";
      }
    }

    // General responses
    if (lowercaseMessage.includes('thank')) {
      return "You're welcome! I'm here to help keep you and your community safe. Don't hesitate to ask if you need more information.";
    }

    // Default responses based on phase
    switch (currentPhase) {
      case 'before':
        return "I can help you with emergency preparedness! Ask me about:\n• Emergency kits and supplies\n• Evacuation planning\n• Family communication plans\n• Safety procedures\n• Risk assessment\n\nWhat specific information do you need?";
      case 'during':
        return "🚨 I'm here for emergency assistance! I can help with:\n• Finding safe locations\n• Evacuation procedures\n• Emergency contacts\n• Safety instructions\n• Resource locations\n\nWhat do you need help with right now?";
      case 'after':
        return "I'm here to help with recovery! I can assist with:\n• Damage assessment\n• Insurance information\n• Aid resources\n• Community support\n• Recovery planning\n\nHow can I help you recover and rebuild?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      phase: currentPhase,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: getAIResponse(inputMessage),
        timestamp: new Date(),
        phase: currentPhase,
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = {
    before: [
      "What should be in my emergency kit?",
      "How do I create an evacuation plan?",
      "Do I need to evacuate with my family in District A?"
    ],
    during: [
      "Where is the nearest shelter?",
      "How do I call for help?",
      "Is my area safe right now?"
    ],
    after: [
      "How do I document damage?",
      "Where can I get aid?",
      "How do I help my community recover?"
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Emergency Assistant Chatbot
          </CardTitle>
          <CardDescription>
            AI-powered emergency assistance for {currentPhase} phase - Ask questions about safety, evacuation, and emergency procedures
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Questions */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Quick Questions:</h4>
            <div className="flex flex-wrap gap-2">
              {quickQuestions[currentPhase].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInputMessage(question)}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.type === 'bot' ? (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-xs opacity-75">
                      {message.type === 'bot' ? 'Emergency Assistant' : 'You'}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white border">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">Emergency Assistant is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask me about emergency procedures, evacuation, safety..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {currentPhase === 'during' && emergencyLevel === 'critical' && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl">🆘</div>
              <h3 className="font-medium text-red-800">Emergency Mode Active</h3>
            </div>
            <p className="text-red-700 text-sm mb-3">
              If you are in immediate danger, use the SOS button or call emergency services directly.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Emergency Call
              </Button>
              <Button size="sm" variant="outline" className="border-red-500 text-red-600">
                SOS Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};