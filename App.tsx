import React, { useState, useEffect } from 'react';
import WaitlistCard from './components/WaitlistCard';
import AboutSection from './components/AboutSection';
import ChatSection from './components/ChatSection';
import { HomeIcon, AboutIcon, ChatIcon, TShirtIcon, UserIcon } from './components/Icons';
import { ViewState, LocationState } from './types';
import { generateWelcomeMessage } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [signupCount, setSignupCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load count from local storage
  useEffect(() => {
    const savedCount = localStorage.getItem('rewear_signup_count');
    if (savedCount) {
      setSignupCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleJoinWaitlist = async (email: string, locState: LocationState) => {
    setIsProcessing(true);
    
    // Generate personalized message via Gemini
    const message = await generateWelcomeMessage(locState.isWithinRange, locState.distanceFromHub);
    
    const newCount = signupCount + 1;
    setSignupCount(newCount);
    localStorage.setItem('rewear_signup_count', newCount.toString());
    setSuccessMessage(message);
    
    setIsProcessing(false);
    setView(ViewState.SUCCESS);
  };

  const DesktopNav = () => (
      <header className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-8 py-4 justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
              <div className="w-10 h-10 bg-[#EFF5F3] rounded-xl flex items-center justify-center">
                  <TShirtIcon className="w-6 h-6 text-[#4A6C58]" />
              </div>
              <span className="font-bold text-xl text-[#1A1A1A]">ReWear.</span>
          </div>
          
          <nav className="flex items-center gap-8">
              <button 
                  onClick={() => setView(ViewState.HOME)}
                  className={`text-sm font-medium transition-colors ${view === ViewState.HOME || view === ViewState.SUCCESS ? 'text-[#1A1A1A]' : 'text-gray-500 hover:text-[#1A1A1A]'}`}
              >
                  Home
              </button>
              <button 
                  onClick={() => setView(ViewState.ABOUT)}
                  className={`text-sm font-medium transition-colors ${view === ViewState.ABOUT ? 'text-[#1A1A1A]' : 'text-gray-500 hover:text-[#1A1A1A]'}`}
              >
                  About Us
              </button>
              <button 
                  onClick={() => setView(ViewState.CHAT)}
                  className={`text-sm font-medium transition-colors ${view === ViewState.CHAT ? 'text-[#1A1A1A]' : 'text-gray-500 hover:text-[#1A1A1A]'}`}
              >
                  Assistant
              </button>
              <div className="ml-4 h-8 w-[1px] bg-gray-200"></div>
              <div>
                 {signupCount > 0 ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        {signupCount.toLocaleString()} joined
                     </span>
                 ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                        Join the revolution
                     </span>
                 )}
              </div>
          </nav>
      </header>
  );

  const renderContent = () => {
    if (view === ViewState.ABOUT) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-80px)] w-full">
            <AboutSection />
        </div>
      );
    }

    if (view === ViewState.CHAT) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-80px)] w-full px-4">
                <ChatSection />
            </div>
        );
    }

    if (view === ViewState.SUCCESS) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-80px)] w-full max-w-md mx-auto text-center px-6">
                 <div className="w-20 h-20 bg-[#4A6C58] rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">You're on the list!</h2>
                 <p className="text-[#4A6C58] font-medium mb-6">Position #{signupCount.toLocaleString()}</p>
                 
                 <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 w-full">
                     <p className="text-gray-600 italic">"{successMessage}"</p>
                 </div>

                 <button 
                    onClick={() => setView(ViewState.HOME)}
                    className="text-gray-400 hover:text-[#1A1A1A] text-sm font-medium transition-colors"
                 >
                    Back to Home
                 </button>
            </div>
        )
    }

    // HOME View
    return (
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-120px)] px-4">
        {/* Desktop Hero Text - Visible only on Desktop */}
        <div className="hidden lg:flex flex-col items-start text-left max-w-xl">
            <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm mb-6 border border-gray-100">
                    <span className="text-[#4A6C58] font-semibold text-sm flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        The waitlist is open
                    </span>
            </div>
            <h1 className="text-6xl font-bold text-[#1A1A1A] leading-tight mb-6">
                Sustainable fashion <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6C58] to-[#2D4A3E]">on campus.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                Join the circular economy. Buy, sell, and trade high-quality pieces with students near you.
            </p>
            <div className="flex gap-4 items-center">
                <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                                <UserIcon />
                        </div>
                    ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                    Join {signupCount.toLocaleString()}+ students
                </p>
            </div>
        </div>

        {/* Mobile Header Logo - Visible only on Mobile */}
        <div className="flex lg:hidden flex-col items-center mt-8">
            <TShirtIcon className="w-20 h-20 text-[#4A6C58] mb-4" />
            <h1 className="text-3xl font-bold text-[#1A1A1A]">ReWear.</h1>
            <p className="text-gray-500 text-sm mt-1">Sustainable Fashion Marketplace</p>
            
            {signupCount > 0 && (
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {signupCount.toLocaleString()} fashionistas joined
                </div>
            )}
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md">
            <WaitlistCard onJoin={handleJoinWaitlist} isLoading={isProcessing} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EFF5F3]">
      <DesktopNav />
      
      {/* Mobile Status Bar Space - Hidden on Desktop */}
      <div className="h-6 md:hidden"></div>

      {/* Main Content */}
      <main className="flex-grow w-full flex flex-col pt-0 lg:pt-20">
        {renderContent()}
      </main>

      {/* Mobile Bottom Nav - Hidden on Desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 pb-8 z-40 lg:hidden">
        <div className="max-w-xs mx-auto flex justify-between items-center px-8">
            <button 
                onClick={() => setView(ViewState.HOME)}
                className="flex flex-col items-center gap-1 w-12"
            >
                <HomeIcon filled={view === ViewState.HOME || view === ViewState.SUCCESS} />
                <span className={`text-[10px] ${view === ViewState.HOME || view === ViewState.SUCCESS ? 'text-[#1A1A1A] font-medium' : 'text-gray-300'}`}>Home</span>
            </button>

            <button 
                onClick={() => setView(ViewState.ABOUT)}
                className="flex flex-col items-center gap-1 w-12"
            >
                <AboutIcon filled={view === ViewState.ABOUT} />
                <span className={`text-[10px] ${view === ViewState.ABOUT ? 'text-[#1A1A1A] font-medium' : 'text-gray-300'}`}>About</span>
            </button>

            <button 
                onClick={() => setView(ViewState.CHAT)}
                className="flex flex-col items-center gap-1 w-12"
            >
                <ChatIcon filled={view === ViewState.CHAT} />
                <span className={`text-[10px] ${view === ViewState.CHAT ? 'text-[#1A1A1A] font-medium' : 'text-gray-300'}`}>Chat</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default App;