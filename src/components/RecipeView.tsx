import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChefHat, Utensils, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import type { Recipe } from '../lib/gemini';
import { cn } from '../lib/utils';

interface RecipeViewProps {
  recipe: Recipe;
  imageUrl: string;
  onReset: () => void;
}

export function RecipeView({ recipe, imageUrl, onReset }: RecipeViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps'>('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Bulletproof data extraction to prevent any React rendering crashes
  const safeRecipe = (typeof recipe === 'object' && recipe !== null) ? recipe : ({} as Recipe);
  const safeIngredients = Array.isArray(safeRecipe.ingredients) ? safeRecipe.ingredients : [];
  const safeTools = Array.isArray(safeRecipe.tools) ? safeRecipe.tools : [];
  const safeSteps = Array.isArray(safeRecipe.steps) ? safeRecipe.steps : [];
  
  const totalSteps = Math.max(1, safeSteps.length);
  const displayStepIndex = Math.min(currentStepIndex, totalSteps - 1);
  const currentStep = safeSteps[displayStepIndex] || {};
  
  const stepIngredients = Array.isArray(currentStep.ingredients) ? currentStep.ingredients : [];
  const stepTools = Array.isArray(currentStep.tools) ? currentStep.tools : [];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header Image */}
      <div className="relative h-72 w-full">
        <img 
          src={imageUrl} 
          alt={safeRecipe.name || '美食'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            {safeRecipe.name || '未知菜品'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-sm mb-4 line-clamp-2"
          >
            {safeRecipe.description || '暂无描述'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-sm font-medium"
          >
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <ChefHat size={16} />
              <span>{safeRecipe.difficulty || '未知难度'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Clock size={16} />
              <span>{safeRecipe.totalTime || '未知时间'}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="flex px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex-1 py-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'overview' ? "border-orange-500 text-orange-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            概览
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={cn(
              "flex-1 py-4 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'steps' ? "border-orange-500 text-orange-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
            )}
          >
            步骤
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Ingredients */}
              <section>
                <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Utensils size={20} className="text-orange-500" />
                  所需食材
                </h2>
                <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                  {safeIngredients.length > 0 ? (
                    <ul className="divide-y divide-neutral-100">
                      {safeIngredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between items-center p-4 hover:bg-neutral-50 transition-colors">
                          <span className="font-medium text-neutral-800">{ing?.name || '未知食材'}</span>
                          <span className="text-neutral-500 text-sm">{ing?.amount || '适量'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-neutral-500 text-sm">暂无食材信息</div>
                  )}
                </div>
              </section>

              {/* Tools */}
              <section>
                <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <ChefHat size={20} className="text-orange-500" />
                  烹饪工具
                </h2>
                {safeTools.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {safeTools.map((tool, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-3 text-center text-sm font-medium text-neutral-700 border border-neutral-100 shadow-sm">
                        {typeof tool === 'string' ? tool : '未知工具'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-neutral-500 text-sm py-4">暂无工具信息</div>
                )}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Step Progress */}
              <div className="flex items-center justify-between text-sm font-medium text-neutral-500 mb-2">
                <span>步骤 {displayStepIndex + 1} / {totalSteps}</span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Clock size={16} />
                  {currentStep.duration || '未知时间'}
                </span>
              </div>

              {/* Current Step Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                
                <p className="text-lg text-neutral-800 leading-relaxed font-medium">
                  {currentStep.instruction || '暂无步骤说明'}
                </p>

                {(stepIngredients.length > 0 || stepTools.length > 0) && (
                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    {stepIngredients.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">本步食材</h4>
                        <div className="flex flex-wrap gap-2">
                          {stepIngredients.map((ing, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
                              {typeof ing === 'string' ? ing : (ing as any)?.name || '未知食材'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {stepTools.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">本步工具</h4>
                        <div className="flex flex-wrap gap-2">
                          {stepTools.map((tool, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium">
                              {typeof tool === 'string' ? tool : '未知工具'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                  disabled={displayStepIndex === 0}
                  className="p-3 rounded-full bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>

                {displayStepIndex === totalSteps - 1 ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <CheckCircle2 size={24} />
                    <span>完成！</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setCurrentStepIndex(prev => Math.min(totalSteps - 1, prev + 1))}
                    className="flex-1 ml-4 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-500/20"
                  >
                    <span>下一步</span>
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-neutral-200">
        <button
          onClick={onReset}
          className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={18} />
          <span>做点别的菜</span>
        </button>
      </div>
    </div>
  );
}
