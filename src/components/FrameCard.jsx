import React from 'react';
const statusColors = {
  PENDING: { bg: '#888888', text: '#ffffff' },
  COPIED: { bg: '#007BFF', text: '#ffffff' },
  GENERATED: { bg: '#00D4AA', text: '#000000' },
  SHARED: { bg: '#9B59B6', text: '#ffffff' }
};

const platformColors = {
  youtube: '#FF0000',
  tiktok: '#000000',
  facebook: '#1877F2',
  instagram: '#E1306C'
};

export default function FrameCard({ frame, actNum, onClick, onStatusChange }) {
  const colors = statusColors[frame.status] || statusColors.PENDING;
  
  const handleCopyPrompt = (e) => {
    e.stopPropagation();
    if (frame.prompt) {
      navigator.clipboard.writeText(frame.prompt);
      if (frame.status === 'PENDING') {
        onStatusChange(actNum, frame.frameNum, { status: 'COPIED' });
      }
    }
  };

  const handleUpload = (e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const filename = `frame-ACT${actNum}-frame${frame.frameNum}.png`;
      onStatusChange(actNum, frame.frameNum, { 
        status: 'GENERATED', 
        filename,
        imageUrl: url 
      });
    }
  };

  return (
    <div 
      onClick={() => onClick(frame)}
      className="bg-gray-800 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors border-2"
      style={{ borderColor: colors.bg }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-sm font-medium text-gray-200">{frame.title}</h4>
          <p className="text-xs text-gray-400">ACT {actNum} • Frame {frame.frameNum}</p>
        </div>
        <span 
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {frame.status}
        </span>
      </div>
      
      {frame.filename || frame.imageUrl ? (
        <div className="aspect-video bg-gray-900 rounded overflow-hidden">
          <img 
            src={frame.imageUrl || frame.filename} 
            alt={frame.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
          <span className="text-gray-600 text-sm">No image</span>
        </div>
      )}
      
      {frame.sharedLinks?.length > 0 && (
        <div className="flex gap-1 mt-2">
          {frame.sharedLinks.map((link, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: platformColors[link.platform] || '#666' }}
            >
              {link.platform}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 mt-2">
        <button 
          onClick={handleCopyPrompt}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Copy Prompt
        </button>
        <label className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
}
