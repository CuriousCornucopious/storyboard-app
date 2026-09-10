import React from 'react';

const STORAGE_KEY = 'storyboard-data';

const createDefaultStory = () => ({
  name: 'UNTITLED NEW STORY',
  acts: Array.from({ length: 5 }, (_, actIndex) => ({
    actNum: actIndex + 1,
    frames: Array.from({ length: 3 }, (_, frameIndex) => ({
      frameNum: frameIndex + 1,
      title: `Scene ${frameIndex + 1}`,
      status: 'PENDING',
      prompt: '',
      filename: '',
      duration: 3,
      transition: 'CUT',
      sharedLinks: [],
      notes: ''
    }))
  })),
  developerNotes: ''
});

export function useStoryStorage() {
  const [story, setStory] = React.useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : createDefaultStory();
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
  }, [story]);

  const updateFrame = (actNum, frameNum, updates) => {
    setStory(prev => ({
      ...prev,
      acts: prev.acts.map(act => 
        act.actNum === actNum
          ? { ...act, frames: act.frames.map(frame =>
              frame.frameNum === frameNum ? { ...frame, ...updates } : frame
            )}
          : act
      )
    }));
  };

  const insertFrame = (actNum, frameNum) => {
    setStory(prev => ({
      ...prev,
      acts: prev.acts.map(act =>
        act.actNum === actNum
          ? {
              ...act,
              frames: [
                ...act.frames.slice(0, frameNum - 1),
                {
                  frameNum,
                  title: `Scene ${frameNum}`,
                  status: 'PENDING',
                  prompt: '',
                  filename: '',
                  duration: 3,
                  transition: 'CUT',
                  sharedLinks: [],
                  notes: ''
                },
                ...act.frames.slice(frameNum - 1).map(f => ({ ...f, frameNum: f.frameNum + 1 }))
              ]
            }
          : act
      )
    }));
  };

  const insertAct = (actNum) => {
    setStory(prev => ({
      ...prev,
      acts: [
        ...prev.acts.slice(0, actNum - 1),
        {
          actNum,
          frames: Array.from({ length: 3 }, (_, i) => ({
            frameNum: i + 1,
            title: `Scene ${i + 1}`,
            status: 'PENDING',
            prompt: '',
            filename: '',
            duration: 3,
            transition: 'CUT',
            sharedLinks: [],
            notes: ''
          }))
        },
        ...prev.acts.slice(actNum - 1).map(a => ({ ...a, actNum: a.actNum + 1 }))
      ]
    }));
  };

  const getProgress = () => {
    let total = 0, completed = 0;
    story.acts.forEach(act => {
      act.frames.forEach(frame => {
        total++;
        if (frame.status === 'SHARED') completed++;
      });
    });
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  };

  return { story, setStory, updateFrame, insertFrame, insertAct, getProgress };
}

export function exportJSON(story) {
  return JSON.stringify(story, null, 2);
}

export function exportEDL(story) {
  let edl = 'TITLE: UNTITLED\nFCM: NON-DROP FRAME\n\n';
  let timecode = 0;
  story.acts.forEach(act => {
    act.frames.forEach(frame => {
      const tc = new Date(timecode * 1000).toISOString().substr(11, 8);
      edl += `${String(frame.frameNum).padStart(3, '0')}  001      V     C        ${tc} 00:00:00:00\n`;
      timecode += frame.duration;
    });
  });
  return edl;
}
