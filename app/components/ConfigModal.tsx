"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TTS_CONFIG_ENDPOINT: '/tts-config'
};

interface Speaker {
  name: string;
  voice_id: string;
  preview_url?: string;
}

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [languageNames, setLanguageNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'speakers' | 'languages'>('speakers');
  
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const speakersResponse = await fetch('https://metropolitan-owner-italiano-believe.trycloudflare.com/speakers');
      if (!speakersResponse.ok) throw new Error('Failed to fetch speakers');
      const speakersData = await speakersResponse.json();
      setSpeakers(Array.isArray(speakersData) ? speakersData : []);
      
      const languagesResponse = await fetch('https://metropolitan-owner-italiano-believe.trycloudflare.com/languages');
      if (!languagesResponse.ok) throw new Error('Failed to fetch languages');
      const data = await languagesResponse.json();
      const names = Object.keys(data.languages);
      setLanguageNames(names);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedVoiceId || !selectedLanguage) return;
  
    try {
      setIsSaving(true);
      setError(null);
  
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.TTS_CONFIG_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voice_id: selectedVoiceId,
          language: selectedLanguage,
          speed: speed
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to save configuration');
      }
  
      const data = await response.json();
      console.log('Configuration updated:', data);
      onClose();
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-auto max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#BC3516]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('speakers')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'speakers'
                ? 'bg-[#BC3516] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Speakers
            </div>
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'languages'
                ? 'bg-[#BC3516] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Languages
            </div>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#BC3516] border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading {activeTab}...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'speakers' ? (
                <motion.div
                  key="speakers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {speakers.map((speaker, index) => (
                    <motion.div
                      key={speaker.voice_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer
                        ${selectedVoiceId === speaker.voice_id ? 'ring-2 ring-[#BC3516]' : ''}`}
                      onClick={() => setSelectedVoiceId(speaker.voice_id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#BC3516] bg-opacity-10 rounded-full p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#BC3516]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-700 font-medium">{speaker.name}</span>
                          {speaker.preview_url && (
                            <audio controls className="mt-2 w-full max-w-[200px]">
                              <source src={speaker.preview_url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="languages"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {languageNames.map((language, index) => (
                    <motion.div
                      key={language}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer
                        ${selectedLanguage === language ? 'ring-2 ring-[#BC3516]' : ''}`}
                      onClick={() => setSelectedLanguage(language)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-[#BC3516] bg-opacity-10 rounded-full p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#BC3516]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{language}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Speed Control */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Speed
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">
                  {speed}x
                </span>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || !selectedVoiceId || !selectedLanguage}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isSaving || !selectedVoiceId || !selectedLanguage
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#BC3516] text-white hover:bg-[#a02d12]'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}