import React, { useState } from 'react';
import { Home } from './components/Home';
import { Loading } from './components/Loading';
import { RecipeView } from './components/RecipeView';
import { generateRecipeFromImage, type Recipe } from './lib/gemini';
import { AlertCircle } from 'lucide-react';

type AppState = 'home' | 'loading' | 'recipe' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleImageSelected = async (file: File) => {
    try {
      setAppState('loading');
      
      // Create local URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // Compress image before sending to AI (prevents payload too large & memory crashes)
      const img = new Image();
      img.src = url;
      
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('无法处理图片');
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed base64
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const base64Data = dataUrl.split(',')[1];

          const generatedRecipe = await generateRecipeFromImage(base64Data, 'image/jpeg');
          setRecipe(generatedRecipe);
          setAppState('recipe');
        } catch (err: any) {
          console.error(err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          setErrorMsg(errorMessage || '分析图片失败，请重试');
          setAppState('error');
        }
      };

      img.onerror = () => {
        setErrorMsg('读取图片失败');
        setAppState('error');
      };
    } catch (err: any) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setErrorMsg(errorMessage || '发生未知错误');
      setAppState('error');
    }
  };

  const handleReset = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setRecipe(null);
    setErrorMsg('');
    setAppState('home');
  };

  if (appState === 'loading') {
    return <Loading />;
  }

  if (appState === 'error') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-sm border border-neutral-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-neutral-900">出错了</h2>
            <p className="text-neutral-500">{errorMsg}</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
          >
            返回重试
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'recipe' && recipe && imageUrl) {
    return <RecipeView recipe={recipe} imageUrl={imageUrl} onReset={handleReset} />;
  }

  return <Home onImageSelected={handleImageSelected} />;
}
