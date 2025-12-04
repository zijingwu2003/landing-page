export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  distanceFromHub: number | null; // Miles from Cornell Tech
  isWithinRange: boolean;
}

export interface WaitlistEntry {
  email: string;
  timestamp: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export enum ViewState {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  CHAT = 'CHAT',
  SUCCESS = 'SUCCESS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}