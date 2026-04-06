import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onImageSelected: (file: File) => void;
}

export function Home({ onImageSelected }: HomeProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelected(e.target.files[0]);
      e.target.value = ''; // Reset input so the same file can be selected again
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900">看图做菜</h1>
          <p className="text-neutral-500 text-lg">上传一张美食照片，AI 为你生成详细食谱</p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-white ring-1 ring-neutral-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-6 hover:bg-neutral-50 transition-colors">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
              <Upload size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-neutral-800">点击上传图片</h3>
              <p className="text-neutral-500 text-sm">支持拍照或从相册选择</p>
            </div>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex justify-center gap-6 text-neutral-400">
          <div className="flex items-center gap-2">
            <Camera size={20} />
            <span className="text-sm">拍照</span>
          </div>
          <div className="flex items-center gap-2">
            <ImageIcon size={20} />
            <span className="text-sm">相册</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
