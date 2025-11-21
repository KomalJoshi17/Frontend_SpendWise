import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../utils/api';
import PageLayout from '../components/PageLayout';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI financial advisor. How can I help you save money today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipOfDay, setTipOfDay] = useState(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      return;
    }
    
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable microphone access in your browser settings.');
        }
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
    
    loadTipOfDay();
  }, []);

  const loadTipOfDay = async () => {
    const today = new Date().toISOString().split('T')[0]; 
    const savedTip = localStorage.getItem('tipOfDay');
    const savedDate = localStorage.getItem('tipDate');
    if (savedTip && savedDate === today) {
      setTipOfDay(savedTip);
      return;
    }

    setLoadingTip(true);
    try {
      const response = await aiAPI.getTip();
      const tip = response.data.tip || 'Track your daily expenses to identify unnecessary spending patterns.';
      setTipOfDay(tip);
      localStorage.setItem('tipOfDay', tip);
      localStorage.setItem('tipDate', today);
    } catch (error) {
      console.error('Error fetching tip:', error);
      setTipOfDay('Track your daily expenses to identify unnecessary spending patterns.');
    } finally {
      setLoadingTip(false);
    }
  };

  const handleStartRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
    } else if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const handleStopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiAPI.chat(
        input,
        'You are a personal financial advisor helping Indian users save money. Give practical, actionable advice.'
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.response || 'I apologize, but I couldn\'t process that request.' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I apologize, but I\'m having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              💬 AI Financial Chatbot
            </h1>
            <p className="text-gray-400">
              Ask me anything about saving money and managing finances
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 h-[500px] flex flex-col">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about saving money..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500"
                  disabled={loading}
                />
                {recognition ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseDown={handleStartRecording}
                    onMouseUp={handleStopRecording}
                    onTouchStart={handleStartRecording}
                    onTouchEnd={handleStopRecording}
                    disabled={loading}
                    className={`p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                    title={isRecording ? 'Recording... Click to stop' : 'Hold to record voice'}
                  >
                    🎤
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    disabled
                    className="p-3 bg-gray-700 text-gray-500 rounded-xl cursor-not-allowed opacity-50"
                    title="Voice input not supported in this browser"
                  >
                    🎤
                  </motion.button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </motion.button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              💡 Tip of the Day
            </h2>
            <p className="text-sm text-gray-400">
              Get a fresh financial tip every day
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-2xl p-6 bg-gradient-to-br from-primary-900/20 to-primary-800/20"
          >
            {loadingTip ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full"
                />
              </div>
            ) : (
              <>
                <p className="text-white leading-relaxed mb-4">
                  {tipOfDay || 'Track your daily expenses to identify unnecessary spending patterns.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    localStorage.removeItem('tipOfDay');
                    localStorage.removeItem('tipDate');
                    setLoadingTip(true);
                    try {
                      const response = await aiAPI.getTip();
                      const tip = response.data.tip || 'Track your daily expenses to identify unnecessary spending patterns.';
                      setTipOfDay(tip);
                      const today = new Date().toISOString().split('T')[0];
                      localStorage.setItem('tipOfDay', tip);
                      localStorage.setItem('tipDate', today);
                    } catch (error) {
                      console.error('Error fetching tip:', error);
                      setTipOfDay('Track your daily expenses to identify unnecessary spending patterns.');
                    } finally {
                      setLoadingTip(false);
                    }
                  }}
                  disabled={loadingTip}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingTip ? 'Loading...' : '🔄 Get New Tip'}
                </motion.button>
              </>
            )}
          </motion.div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Quick Questions</h3>
            <div className="space-y-2">
              {[
                'How can I save money?',
                'Should I spend ₹2000 on a birthday gift?',
                'Tell me how to reduce food expenses'
              ].map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(question)}
                  className="w-full text-left px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm text-gray-300"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIChat;

