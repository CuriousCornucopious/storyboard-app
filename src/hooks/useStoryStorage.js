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
          ? {
              ...act,
              frames: act.frames.map(frame =>
                frame.frameNum === frameNum
                  ? { ...frame, ...updates }
                  : frame
              )
            }
          : act
      )
    }));
  };

  const insertFrame = (actNum, afterFrameNum = null) => {
    setStory(prev => ({
      ...prev,
      acts: prev.acts.map(act => {
        if (act.actNum !== actNum) return act;
        const newFrames = [];
        act.frames.forEach((frame, idx) => {
          newFrames.push(frame);
          if (afterFrameNum === frame.frameNum) {
            newFrames.push({
              frameNum: frame.frameNum + 0.5,
              title: 'New Frame',
              status: 'PENDING',
              prompt: '',
              filename: '',
              duration: 3,
              transition: 'CUT',
              sharedLinks: [],
              notes: ''
            });
          }
        });
        if (afterFrameNum === null) {
          newFrames.push({
            frameNum: newFrames.length + 1,
            title: 'New Frame',
            status: 'PENDING',
            prompt: '',
            filename: '',
            duration: 3,
            transition: 'CUT',
            sharedLinks: [],
            notes: ''
          });
        }
        // Renumber frames
        return {
          ...act,
          frames: newFrames
            .sort((a, b) => a.frameNum - b.frameNum)
            .map((f, i) => ({ ...f, frameNum: i + 1 }))
        };
      })
    }));
  };

  const insertAct = (afterActNum = null) => {
    setStory(prev => {
      const newActs = [];
      prev.acts.forEach((act, idx) => {
        newActs.push(act);
        if (afterActNum === act.actNum) {
          newActs.push({
            actNum: act.actNum + 0.5,
            frames: [{
              frameNum: 1,
              title: 'Scene 1',
              status: 'PENDING',
              prompt: '',
              filename: '',
              duration: 3,
              transition: 'CUT',
              sharedLinks: [],
              notes: ''
            }]
          });
        }
      });
      if (afterActNum === null) {
        newActs.push({
          actNum: newActs.length + 1,
          frames: [{
            frameNum: 1,
            title: 'Scene 1',
            status: 'PENDING',
            prompt: '',
            filename: '',
            duration: 3,
            transition: 'CUT',
            sharedLinks: [],
            notes: ''
          }]
        });
      }
      return {
        ...prev,
        acts: newActs
          .sort((a, b) => a.actNum - b.actNum)
          .map((a, i) => ({ ...a, actNum: i + 1 }))
      };
    });
  };

  const getProgress = () => {
    let total = 0;
    let complete = 0;
    story.acts.forEach(act => {
      act.frames.forEach(frame => {
        total++;
        if (frame.status !== 'PENDING') complete++;
      });
    });
    return { total, complete, percent: total > 0 ? Math.round((complete / total) * 100) : 0 };
  };

  return {
    story,
    setStory,
    updateFrame,
    insertFrame,
    insertAct,
    getProgress
  };
}

export function exportJSON(story) {
  return JSON.stringify(story, null, 2);
}

export function exportEDL(story) {
  let edl = `TITLE: ${story.name}\n`;
  let timecode = 0;
  
  story.acts.forEach(act => {
    act.frames.forEach(frame => {
      if (frame.filename) {
        const tc = new Date(timecode * 1000).toISOString().substr(11, 8);
        edl += `${tc}  ${frame.filename}  ${frame.duration}  ${frame.transition}\n`;
        timecode += frame.duration;
      }
    });
  });
  
  return edl;
}

export default useStoryStorage;
