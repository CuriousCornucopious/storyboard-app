import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useStoryStorage, exportJSON, exportEDL } from './hooks/useStoryStorage';
import ActColumn from './components/ActColumn';
import FilterBar from './components/FilterBar';
import ExpandedFrame from './components/ExpandedFrame';
import Slideshow from './components/Slideshow';
import DeveloperNotes from './components/DeveloperNotes';

export default function App() {
  const { story, setStory, updateFrame, insertFrame, insertAct, getProgress } = useStoryStorage();
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedAct, setSelectedAct] = useState(null);
  const [statusFilter, setStatusFilter] = useState(['PENDING', 'COPIED', 'GENERATED', 'SHARED']);
  const [platformFilter, setPlatformFilter] = useState([]);
  const [showSlideshow, setShowSlideshow] = useState(false);
  
  const progress = getProgress();
  
  const handleStatusChange = useCallback((actNum, frameNum, updates) => {
    updateFrame(actNum, frameNum, updates);
  }, [updateFrame]);
  
  const handleFrameClick = (frame, actNum) => {
    setSelectedFrame(frame);
    setSelectedAct(actNum);
  };
  
  const handleCloseExpanded = () => {
    setSelectedFrame(null);
    setSelectedAct(null);
  };
  
  const handleUpdateFrame = (actNum, frameNum, updates) => {
    updateFrame(actNum, frameNum, updates);
    setSelectedFrame(prev => prev ? { ...prev, ...updates } : null);
  };
  
  const handleStoryNameChange = (name) => {
    setStory(prev => ({ ...prev, name }));
  };
  
  const handleNotesChange = (notes) => {
    setStory(prev => ({ ...prev, developerNotes: notes }));
  };
  
  // Filter frames
  const filteredActs = story.acts.map(act => ({
    ...act,
    frames: act.frames.filter(frame => {
      if (statusFilter.length && !statusFilter.includes(frame.status)) return false;
      if (frame.status === 'SHARED' && platformFilter.length) {
        const hasPlatform = frame.sharedLinks?.some(l => platformFilter.includes(l.platform));
        if (!hasPlatform) return false;
      }
      return true;
    })
  })).filter(act => act.frames.length > 0);
  
  // Export functions
  const handleExportJSON = () => {
    const blob = new Blob([exportJSON(story)], { type: 'application/json' });
    saveAs(blob, `${story.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`);
  };
  
  const handleExportEDL = () => {
    const blob = new Blob([exportEDL(story)], { type: 'text/plain' });
    saveAs(blob, `${story.name.replace(/\s+/g, '-').toLowerCase()}.edl`);
  };
  
  const handleExportZIP = async () => {
    const zip = new JSZip();
    zip.file('project.json', exportJSON(story));
    
    const assets = zip.folder('assets');
    const promises = [];
    
    story.acts.forEach(act => {
      act.frames.forEach(frame => {
        if (frame.imageUrl && frame.imageUrl.startsWith('blob:')) {
          promises.push(
            fetch(frame.imageUrl)
              .then(res => res.blob())
              .then(blob => {
                assets.file(frame.filename || `frame-${act.actNum}-${frame.frameNum}.png`, blob);
              })
          );
        }
      });
    });
    
    await Promise.all(promises);
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${story.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.zip`);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">🎬 Storyboard App</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSlideshow(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ▶ Preview
            </button>
            <button
              onClick={insertAct}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              + Add ACT
            </button>
            <div className="relative group">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Export ▼
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-lg hidden group-hover:block z-10">
                <button
                  onClick={handleExportJSON}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200"
                >
                  📄 Export JSON
                </button>
                <button
                  onClick={handleExportEDL}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200"
                >
                  🎞️ Export EDL
                </button>
                <button
                  onClick={handleExportZIP}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200"
                >
                  📦 Export ZIP
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Bar */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          progress={progress}
          storyName={story.name}
          onStoryNameChange={handleStoryNameChange}
        />
        
        {/* ACT Columns */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredActs.map(act => (
            <ActColumn
              key={act.actNum}
              act={act}
              onFrameClick={(frame) => handleFrameClick(frame, act.actNum)}
              onStatusChange={handleStatusChange}
              onAddFrame={(actNum) => insertFrame(actNum)}
            />
          ))}
        </div>
        
        {/* Developer Notes */}
        <DeveloperNotes
          notes={story.developerNotes}
          onChange={handleNotesChange}
        />
        
        {/* Expanded Frame Modal */}
        {selectedFrame && selectedAct && (
          <ExpandedFrame
            frame={selectedFrame}
            actNum={selectedAct}
            onClose={handleCloseExpanded}
            onUpdate={handleUpdateFrame}
          />
        )}
        
        {/* Slideshow */}
        <Slideshow
          story={story}
          isOpen={showSlideshow}
          onClose={() => setShowSlideshow(false)}
        />
      </div>
    </div>
  );
}
