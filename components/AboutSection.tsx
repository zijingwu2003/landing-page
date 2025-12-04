import React from 'react';
import { TShirtIcon, GlobeIcon, RecycleIcon, HeartIcon } from './Icons';

const AboutSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-24 lg:pb-0 lg:pt-8 px-4">
      
      {/* Header */}
      <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-12">
        <h1 className="text-2xl lg:text-4xl font-bold text-[#1A1A1A]">About Us</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Brand Hero - Spans full width or side */}
          <div className="lg:col-span-12 flex flex-col items-center mb-4 lg:mb-8 text-center">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <TShirtIcon className="w-12 h-12 lg:w-16 lg:h-16 text-[#4A6C58]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1A1A1A] mb-2">ReWear.</h2>
            <p className="text-gray-500 font-medium lg:text-xl">Keep Fashion in the Loop</p>
          </div>

          {/* Vision Card */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-50 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                <GlobeIcon className="text-[#4A6C58] w-6 h-6" />
                <h3 className="font-bold text-[#1A1A1A] text-lg">Our Vision</h3>
            </div>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                A world where clothes are shared, reused, and repurposed to minimize waste. We envision a campus without fast fashion, where every garment has multiple lives.
            </p>
          </div>

           {/* Mission Card */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-50 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                 <RecycleIcon className="text-[#4A6C58] w-6 h-6" />
                <h3 className="font-bold text-[#1A1A1A] text-lg">Our Mission</h3>
            </div>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                ReWear is dedicated to transforming the way we consume fashion. We're building a circular economy platform that makes it effortless for students to trade high-quality pieces locally.
            </p>
          </div>

          {/* Values Grid */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-50 h-full flex flex-col">
             <div className="flex items-center gap-3 mb-4">
                <HeartIcon className="text-[#4A6C58] w-6 h-6" />
                <h3 className="font-bold text-[#1A1A1A] text-lg">Our Values</h3>
            </div>
             <ul className="space-y-4 flex-grow">
                <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A6C58] mt-2 shrink-0"></span>
                    <div>
                        <strong className="text-sm lg:text-base text-[#1A1A1A]">Sustainability First</strong>
                        <p className="text-xs lg:text-sm text-gray-500">Every decision we make prioritizes the planet.</p>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A6C58] mt-2 shrink-0"></span>
                    <div>
                        <strong className="text-sm lg:text-base text-[#1A1A1A]">Community Centric</strong>
                        <p className="text-xs lg:text-sm text-gray-500">Built by students, for students.</p>
                    </div>
                </li>
                 <li className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A6C58] mt-2 shrink-0"></span>
                    <div>
                        <strong className="text-sm lg:text-base text-[#1A1A1A]">Accessible Style</strong>
                        <p className="text-xs lg:text-sm text-gray-500">Great fashion shouldn't cost the earth.</p>
                    </div>
                </li>
             </ul>
          </div>
      </div>
    </div>
  );
};

export default AboutSection;