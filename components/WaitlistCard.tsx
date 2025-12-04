import React, { useState } from 'react';
import { LocationState } from '../types';
import { calculateDistance, HUB_LAT, HUB_LNG, MAX_RANGE_MILES } from '../utils/geo';

interface WaitlistCardProps {
  onJoin: (email: string, locationState: LocationState) => void;
  isLoading: boolean;
}

const WaitlistCard: React.FC<WaitlistCardProps> = ({ onJoin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [locState, setLocState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    distanceFromHub: null,
    isWithinRange: false,
  });
  const [locationChecked, setLocationChecked] = useState(false);
  const [isCheckingLoc, setIsCheckingLoc] = useState(false);

  const handleLocationCheck = () => {
    setIsCheckingLoc(true);
    if (!navigator.geolocation) {
      setLocState(prev => ({ ...prev, error: "Geolocation not supported" }));
      setLocationChecked(true);
      setIsCheckingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, HUB_LAT, HUB_LNG);
        setLocState({
          latitude,
          longitude,
          error: null,
          distanceFromHub: dist,
          isWithinRange: dist <= MAX_RANGE_MILES,
        });
        setLocationChecked(true);
        setIsCheckingLoc(false);
      },
      (err) => {
        setLocState(prev => ({ ...prev, error: "Location access denied" }));
        setLocationChecked(true);
        setIsCheckingLoc(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onJoin(email, locState);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Join the Waitlist</h2>
        <p className="text-sm text-gray-500 mt-2">
          Get early access to the circular economy <br className="hidden sm:block" />
          and keep fashion in the loop!
        </p>
      </div>

      <div className="mb-6">
        {!locationChecked ? (
          <div className="bg-[#EFF5F3] p-4 rounded-xl mb-4 text-center">
            <p className="text-sm text-[#4A6C58] mb-3">See if ReWear is active in your area.</p>
            <button 
              type="button"
              onClick={handleLocationCheck}
              disabled={isCheckingLoc}
              className="w-full py-2 px-4 border border-[#4A6C58] text-[#4A6C58] rounded-xl text-sm font-medium hover:bg-[#4A6C58] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
               {isCheckingLoc ? (
                 <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"/>
               ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               )}
               Check Availability
            </button>
          </div>
        ) : (
          <div className={`p-4 rounded-xl mb-4 text-center ${locState.isWithinRange ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
            {locState.isWithinRange ? (
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🎉</span>
                <p className="font-semibold text-sm">You're in the Launch Zone!</p>
                <p className="text-xs opacity-80 mt-1">{locState.distanceFromHub?.toFixed(1)} miles from Cornell Tech.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                 <span className="text-2xl mb-1">🌏</span>
                <p className="font-semibold text-sm">Expanding soon!</p>
                <p className="text-xs opacity-80 mt-1">
                  {locState.error ? "Location skipped." : "You're outside our beta zone, but expanding fast."}
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-[#F8F9FA] border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4A6C58] focus:border-transparent outline-none transition-all"
              placeholder="Email Address"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#1A1A1A] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WaitlistCard;