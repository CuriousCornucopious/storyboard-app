import React from 'react';
import { useState } from 'react';
import FrameCard from './FrameCard';

export default function ActColumn({ act, onFrameClick, onStatusChange, onAddFrame }) {
  const [expanded, setExpanded] = useState(false);
  
  const generatedCount = act.frames.filter(f => f.status !== 'PENDING').length;
  const totalCount = act.frames.length;
  
  return (
    <div className={`flex flex-col ${expanded ? 'w-80' : 'w-64'} transition-all duration-300`}>
      <div 
        onClick={() => setExpanded(!expanded)}
        className="bg-gray-800 rounded-t-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors flex justify-between items-center"
      >
        <div>
          <h3 className="text-lg font-bold text-white">ACT {act.actNum}</h3>
          <p className="text-xs text-gray-400">{generatedCount}/{totalCount} frames</p>
        </div>
        <span className="text-gray-400 text-xl">
          {expanded ? '▼' : '▶'}
        </span>
      </div>
      
      <div className={`bg-gray-900 rounded-b-lg p-3 overflow-y-auto ${expanded ? 'max-h-[600px]' : 'max-h-[200px]'}`}>
        {act.frames.map((frame, idx) => (
          <div key={frame.frameNum} className="mb-3">
            <FrameCard 
              frame={frame} 
              actNum={act.actNum}
              onClick={onFrameClick}
              onStatusChange={onStatusChange}
            />
          </div>
        ))}
        
        <button
          onClick={() => onAddFrame(act.actNum)}
          className="w-full py-2 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors"
        >
          + Add Frame
        </button>
      </div>
    </div>
  );
}
