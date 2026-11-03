import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  ShoppingCart, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { Language, AiChatMessage, Product } from '../types';
import { translations } from '../translations';
import { mockProducts } from '../data/mockData';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddToCart,
  onViewProduct,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'yi'
        ? `שלום עליכם! איך בין אייער היימישער AI קויף אסיסטענט. איך פארשטיי סאטמארער אידיש און ענגליש. קענט מיר פרעגן וועגן כשרות הכשרים (התאחדות הרבנים, סאטמאר, קראסנא), שבת צרכים, מתנות פאר א שמחה, אדער סיי וועלכע פראדוקט. ווי קען איך אייך היינט העלפן?`
        : `Shalom Aleichem! Welcome to the HeimishMarket AI Shopping Concierge. I am fluent in Heimish (Satmar) Yiddish and English. Ask me about Glatt Kosher certifications (Hisachdus Harabanim, Satmar, Krasna), Shabbos preparations, simcha gifts, or finding specific items. How can I assist you today?`,
      language: language,
      timestamp: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: AiChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      language: language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language,
          history: messages.slice(-5)
        })
      });

      const data = await response.json();
      
      // Auto-match suggested products from catalog if keywords present
      const qLower = query.toLowerCase();
      let matchedProdIds: string[] = [];
      if (qLower.includes('meat') || qLower.includes('פלייש') || qLower.includes('ribeye') || qLower.includes('ראוסט')) {
        matchedProdIds.push('prod-1', 'prod-6');
      }
      if (qLower.includes('challah') || qLower.includes('חלה') || qLower.includes('חלות') || qLower.includes('bakery')) {
        matchedProdIds.push('prod-2', 'prod-7');
      }
      if (qLower.includes('menorah') || qLower.includes('מנורה') || qLower.includes('silver') || qLower.includes('זילבער') || qLower.includes('חנוכה')) {
        matchedProdIds.push('prod-8', 'prod-3');
      }
      if (qLower.includes('bekishe') || qLower.includes('בעקישע') || qLower.includes('קליידער') || qLower.includes('attire')) {
        matchedProdIds.push('prod-4');
      }
      if (qLower.includes('sefer') || qLower.includes('ספר') || qLower.includes('ספרים') || qLower.includes('חומש')) {
        matchedProdIds.push('prod-5');
      }

      const botMsg: AiChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: data.reply || (language === 'yi' ? 'א דאנק פאר׳ן זיך ווענדן! ווי קען איך אייך נאך העלפן?' : 'Thank you for reaching out! How else can I assist you?'),
        language: language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: matchedProdIds.length > 0 ? matchedProdIds : undefined
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: AiChatMessage = {
        id: 'bot-fallback-' + Date.now(),
        sender: 'assistant',
        text: language === 'yi'
          ? 'אנטשולדיגט, ביטע פרובירט נאכאמאל. מיר האבן פארשידענע מהדרין פראדוקטן פאר שבת און יום טוב.'
          : 'Excuse me, please try again. We have a variety of Mehadrin products for Shabbos and Yom Tov.',
        language: language,
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3A8A] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-inner">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {t.aiConciergeTitle}
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {t.aiConciergeSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-[#0B192C] text-amber-300 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-4 shadow-2xs space-y-2 ${
                  isBot 
                    ? 'bg-white border border-slate-200/80 text-slate-800' 
                    : 'bg-[#0B192C] text-white'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {/* Render Suggested Product Cards if present */}
                  {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {language === 'yi' ? 'געפונענע פראדוקטן אין געשעפט:' : 'Recommended Products:'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.suggestedProducts.map((pId) => {
                          const prod = mockProducts.find(p => p.id === pId);
                          if (!prod) return null;
                          return (
                            <div 
                              key={prod.id} 
                              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/60 transition-colors flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="truncate">
                                <div className="font-bold text-slate-900 truncate">
                                  {language === 'yi' ? prod.titleYi : prod.titleEn}
                                </div>
                                <div className="text-emerald-700 font-semibold">${prod.price.toFixed(2)}</div>
                              </div>
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#0B192C] text-white font-bold hover:bg-blue-900 cursor-pointer text-[11px] shrink-0"
                              >
                                {t.addToCart}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className={`text-[10px] block text-end ${isBot ? 'text-slate-400' : 'text-slate-300'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-[#0B192C] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                <span>{language === 'yi' ? 'דער היימישער אסיסטענט טראכט...' : 'Heimish Concierge is thinking...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200/60 overflow-x-auto flex gap-2 scrollbar-none">
          {t.suggestedQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(query)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white hover:bg-amber-50 text-slate-700 border border-slate-200 hover:border-amber-300 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askAiPlaceholder}
              disabled={isLoading}
              className="flex-1 bg-slate-100 border border-slate-200 focus:bg-white text-slate-900 px-4 py-2.5 rounded-full text-sm outline-hidden focus:ring-2 focus:ring-[#0B192C]/20 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-full bg-[#0B192C] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <span>{t.send}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
