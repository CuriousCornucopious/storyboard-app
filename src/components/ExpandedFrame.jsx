import React from 'react';
import { useState, useEffect } from 'react';

const platformColors = {
  youtube: '#FF0000',
  tiktok: '#000000',
  facebook: '#1877F2',
  instagram: '#E1306C'
};

const detectPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  if (url.includes('instagram.com')) return 'instagram';
  return null;
};

export default function ExpandedFrame({ frame, actNum, onClose, onUpdate }) {
  const [linkInput, setLinkInput] = useState('');
  const [localFrame, setLocalFrame] = useState(frame);
  
  useEffect(() => {
    setLocalFrame(frame);
  }, [frame]);
  
  const handleCopyPrompt = () => {
    if (localFrame.prompt) {
      navigator.clipboard.writeText(localFrame.prompt);
      if (localFrame.status === 'PENDING') {
        setLocalFrame(prev => ({ ...prev, status: 'COPIED' }));
        onUpdate(actNum, frame.frameNum, { status: 'COPIED' });
      }
    }
  };
  
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const filename = `frame-ACT${actNum}-frame${frame.frameNum}.png`;
      setLocalFrame(prev => ({ ...prev, status: 'GENERATED', filename, imageUrl: url }));
      onUpdate(actNum, frame.frameNum, { status: 'GENERATED', filename, imageUrl: url });
    }
  };
  
  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const platform = detectPlatform(linkInput);
    if (platform) {
      const newLinks = [...(localFrame.sharedLinks || []), { url: linkInput, platform }];
      setLocalFrame(prev => ({ 
        ...prev, 
        status: 'SHARED',
        sharedLinks: newLinks 
      }));
      onUpdate(actNum, frame.frameNum, { 
        status: 'SHARED',
        sharedLinks: newLinks 
      });
      setLinkInput('');
    }
  };
  
  const handleRemoveLink = (index) => {
    const newLinks = localFrame.sharedLinks.filter((_, i) => i !== index);
    const newStatus = newLinks.length > 0 ? 'SHARED' : 
      (localFrame.filename || localFrame.imageUrl) ? 'GENERATED' : 'COPIED';
    setLocalFrame(prev => ({ ...prev, status: newStatus, sharedLinks: newLinks }));
    onUpdate(actNum, frame.frameNum, { status: newStatus, sharedLinks: newLinks });
  };
  
  const handleFieldChange = (field, value) => {
    setLocalFrame(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBlur = (field) => {
    onUpdate(actNum, frame.frameNum, { [field]: localFrame[field] });
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <input
              type="text"
              value={localFrame.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className="text-xl font-bold bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 outline-none"
            />
            <p className="text-sm text-gray-400">ACT {actNum} • Frame {frame.frameNum}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-4 space-y-4">
          {localFrame.imageUrl || localFrame.filename ? (
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={localFrame.imageUrl || localFrame.filename} 
                alt={localFrame.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <label className="cursor-pointer text-gray-500 hover:text-gray-400">
                <span className="text-lg">Click to upload image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleCopyPrompt}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Copy Prompt
            </button>
            <label className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center cursor-pointer">
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Prompt</label>
            <textarea
              value={localFrame.prompt}
              onChange={(e) => handleFieldChange('prompt', e.target.value)}
              onBlur={() => handleBlur('prompt')}
              className="w-full bg-gray-900 text-gray-200 p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none h-32"
              placeholder="Enter prompt for this frame..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (sec)</label>
              <input
                type="number"
                value={localFrame.duration}
                onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 3)}
                onBlur={() => handleBlur('duration')}
                className="w-full bg-gray-900 text-gray-200 p-2 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Transition</label>
              <select
                value={localFrame.transition}
                onChange={(e) => {
                  handleFieldChange('transition', e.target.value);
                  handleBlur('transition');
                }}
                className="w-full bg-gray-900 text-gray-200 p-2 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
              >
                <option value="CUT">CUT</option>
                <option value="FADE">FADE</option>
                <option value="DISSOLVE">DISSOLVE</option>
                <option value="NONE">NONE</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Shared Links</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                className="flex-1 bg-gray-900 text-gray-200 p-2 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="Paste YouTube/TikTok link..."
              />
              <button
                onClick={handleAddLink}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-lg"
              >
                Add
              </button>
            </div>
            {localFrame.sharedLinks?.length > 0 && (
              <div className="space-y-2">
                {localFrame.sharedLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platformColors[link.platform] }}
                    />
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex-1 truncate">
                      {link.url}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(i)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={localFrame.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              className="w-full bg-gray-900 text-gray-200 p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none h-24"
              placeholder="Notes for this frame..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
