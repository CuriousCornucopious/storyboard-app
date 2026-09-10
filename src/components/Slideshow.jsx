import { useState, useEffect } from 'react';

export default function Slideshow({ story, isOpen, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Build flat array of all frames with images
  const frames = [];
  story.acts.forEach(act => {
    act.frames.forEach(frame => {
      if (frame.filename || frame.imageUrl) {
        frames.push({ ...frame, actNum: act.actNum });
      }
    });
  });
  
  useEffect(() => {
    let interval;
    if (playing && frames.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          if (next >= frames.length) {
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, (frames[currentIndex]?.duration || 3) * 1000);
    }
    return () => clearInterval(interval);
  }, [playing, currentIndex, frames]);
  
  const currentFrame = frames[currentIndex];
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">🎬 Slideshow Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-6">
          {currentFrame ? (
            <>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                <img 
                  src={currentFrame.imageUrl || currentFrame.filename} 
                  alt={currentFrame.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-white">{currentFrame.title}</h4>
                <p className="text-gray-400">ACT {currentFrame.actNum} • Frame {currentFrame.frameNum}</p>
              </div>
            </>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">No frames with images yet!</p>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              ◀ Prev
            </button>
            
            <button
              onClick={() => setPlaying(!playing)}
              disabled={frames.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            
            <button
              onClick={() => setCurrentIndex(prev => Math.min(frames.length - 1, prev + 1))}
              disabled={currentIndex >= frames.length - 1}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>
          
          {frames.length > 0 && (
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max={frames.length - 1}
                value={currentIndex}
                onChange={(e) => {
                  setCurrentIndex(parseInt(e.target.value));
                  setPlaying(false);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Frame {currentIndex + 1} of {frames.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
