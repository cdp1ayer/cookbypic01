import React from 'react';
import { motion } from 'motion/react';
import { ChefHat } from 'lucide-react';

export function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-8"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-neutral-200 border-t-orange-500"
          />
          <div className="absolute inset-0 flex items-center justify-center text-orange-500">
            <ChefHat size={32} />
          </div>
        </div>
        
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-semibold text-neutral-800">AI 正在分析菜品...</h2>
          <p className="text-neutral-500 text-sm">正在识别食材并生成烹饪步骤</p>
        </div>
      </motion.div>
    </div>
  );
}
