"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ConfigModal } from "./components/ConfigModal";

export default function LandingPage() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <main className="h-full flex flex-col items-center justify-center relative" style={{ background: 'transparent' }}>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsConfigOpen(true)}
        className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#BC3516]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-gray-700 font-medium">Configuration</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-6">Welcome to Voice Assistant</h1>
        <p className="text-lg mb-8 max-w-md">
          Experience the power of AI-driven voice interactions. Start a conversation with our intelligent assistant.
        </p>
        <Link 
          href="/voice-chat" 
          className="inline-block px-6 py-3 bg-[#BC3516] text-white rounded-md hover:bg-[#a02d12] transition-colors"
        >
          Get Started
        </Link>
      </motion.div>

      <ConfigModal 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </main>
  );
}
