export default function FilterBar({ 
  statusFilter, 
  onStatusFilterChange,
  platformFilter,
  onPlatformFilterChange,
  progress,
  storyName,
  onStoryNameChange
}) {
  const statuses = ['PENDING', 'COPIED', 'GENERATED', 'SHARED'];
  const platforms = ['youtube', 'tiktok', 'facebook', 'instagram'];
  
  const toggleStatus = (status) => {
    const newFilter = statusFilter.includes(status)
      ? statusFilter.filter(s => s !== status)
      : [...statusFilter, status];
    onStatusFilterChange(newFilter);
  };
  
  const togglePlatform = (platform) => {
    const newFilter = platformFilter.includes(platform)
      ? platformFilter.filter(p => p !== platform)
      : [...platformFilter, platform];
    onPlatformFilterChange(newFilter);
  };
  
  const allSelected = statusFilter.length === statuses.length;
  const toggleAll = () => {
    onStatusFilterChange(allSelected ? [] : [...statuses]);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={storyName}
            onChange={(e) => onStoryNameChange(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Story name..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">
            {progress.complete}/{progress.total} frames ({progress.percent}%)
          </span>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-gray-400 text-sm">Status:</span>
        <button
          onClick={toggleAll}
          className={`px-3 py-1 rounded-full text-sm ${
            allSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          ALL
        </button>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={`px-3 py-1 rounded-full text-sm ${
              statusFilter.includes(status) 
                ? status === 'PENDING' ? 'bg-gray-500 text-white' :
                  status === 'COPIED' ? 'bg-blue-500 text-white' :
                  status === 'GENERATED' ? 'bg-green-500 text-black' :
                  'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      
      {statusFilter.includes('SHARED') && (
        <div className="flex flex-wrap gap-2 items-center mt-3">
          <span className="text-gray-400 text-sm">Platform:</span>
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-3 py-1 rounded-full text-sm ${
                platformFilter.includes(platform)
                  ? platform === 'youtube' ? 'bg-red-600 text-white' :
                    platform === 'tiktok' ? 'bg-black text-white' :
                    platform === 'facebook' ? 'bg-blue-600 text-white' :
                    'bg-pink-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
