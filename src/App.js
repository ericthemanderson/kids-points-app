import React, { useState, useEffect, useRef } from 'react';
import { Award, Settings, Home, CheckSquare, Plus, Trash2, ChevronUp, ChevronDown, Play, Pause, RotateCcw } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';

const KidsPointsApp = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentActivity, setCurrentActivity] = useState(null);
  
  const [kids, setKids] = useState([
    { id: 1, name: 'Kid 1', avatar: '👧', totalPoints: 0, earnedPoints: 0 },
    { id: 2, name: 'Kid 2', avatar: '👦', totalPoints: 0, earnedPoints: 0 }
  ]);

  const [morningTasks, setMorningTasks] = useState([
    'Wake up', 'Bathroom', 'Brush teeth', 'Brush hair', 'Get dressed', 'Eat breakfast', 'Shoes & jacket', 'Backpack'
  ]);

  const [chores, setChores] = useState([
    { id: 1, name: 'Make bed', points: 2 },
    { id: 2, name: 'Finish homework', points: 3 },
    { id: 3, name: 'Put toys away', points: 2 },
    { id: 4, name: 'Practice instruments', points: 5 }
  ]);

  const [bedtimeTasks, setBedtimeTasks] = useState([
    'Go upstairs', 'Bathroom', 'In bath', 'Out bath', 'Brush teeth', 'Pajamas', 'In bed'
  ]);

  const [rewards, setRewards] = useState([
    { id: 2, name: 'Book Reading', icon: '📚', description: '30 min reading time', cost: 10, enabled: true },
    { id: 3, name: 'Screen Time', icon: '📱', description: '30 min device time', cost: 15, enabled: true },
    { id: 4, name: 'Video Game Time', icon: '🎮', description: '30 min gaming', cost: 20, enabled: true },
    { id: 5, name: 'Story Time', icon: '📖', description: 'Extra bedtime story', cost: 8, enabled: true },
    { id: 6, name: 'Candy', icon: '🍬', description: 'A piece of candy', cost: 5, enabled: true },
    { id: 7, name: 'Money', icon: '💵', description: '$1 cash', cost: 10, enabled: true }
  ]);

  const emojiOptions = ['📚', '📱', '🎮', '📖', '🍦', '🎨', '🎬', '🎵', '⚽', '🏀', '🎾', '🏈', '🎯', '🎪', '🎭', '🎸', '🎹', '🎤', '🎧', '🎮', '🕹️', '🎲', '🧩', '🪀', '🎳', '🏓', '🥊', '🥋', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵', '🤹', '🍕', '🍔', '🍟', '🌭', '🍿', '🧁', '🍰', '🎂', '🍪', '🍩', '🍫', '🍬', '🍭', '🧃', '🥤', '🍹', '🍨', '🧊', '🎈', '🎉', '🎊', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💫', '✨', '🔥', '💎', '👑', '🎯'];

  const [settingsSection, setSettingsSection] = useState('main');
  const [morningActive, setMorningActive] = useState(false);
  const [morningTime, setMorningTime] = useState(0);
  const [morningCompleted, setMorningCompleted] = useState({});
  const [morningLapTimes, setMorningLapTimes] = useState({});
  const [morningShowSummary, setMorningShowSummary] = useState(false);
  const [morningHistory, setMorningHistory] = useState([]);
  const morningIntervalRef = useRef(null);
  
  const [choresCompleted, setChoresCompleted] = useState({});
  const [choresHistory, setChoresHistory] = useState([]);
  
  const [bedtimeActive, setBedtimeActive] = useState(false);
  const [bedtimeTime, setBedtimeTime] = useState(0);
  const [bedtimeCompleted, setBedtimeCompleted] = useState({});
  const [bedtimeLapTimes, setBedtimeLapTimes] = useState({});
  const [bedtimeShowSummary, setBedtimeShowSummary] = useState(false);
  const [bedtimeHistory, setBedtimeHistory] = useState([]);
  const bedtimeIntervalRef = useRef(null);
  
  const [selectedReward, setSelectedReward] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedKidForReward, setSelectedKidForReward] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editingKidId, setEditingKidId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingRewardId, setEditingRewardId] = useState(null);
  const [appStateTime, setAppStateTime] = useState(null);
  const [morningStartTime, setMorningStartTime] = useState(null);
  const [bedtimeStartTime, setBedtimeStartTime] = useState(null);
  
  // Countdown timer settings
  const [morningUseCountdown, setMorningUseCountdown] = useState(false);
  const [morningCountdownMinutes, setMorningCountdownMinutes] = useState(15);
  const [bedtimeUseCountdown, setBedtimeUseCountdown] = useState(false);
  const [bedtimeCountdownMinutes, setBedtimeCountdownMinutes] = useState(20);
  
  // Instructions page state
  const [showInstructions, setShowInstructions] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const avatarOptions = [
    // Kids - various skin tones
    '👶', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿',
    '🧒', '🧒🏻', '🧒🏼', '🧒🏽', '🧒🏾', '🧒🏿',
    '👦', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿',
    '👧', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿',
    // Adults - various skin tones
    '👨', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿',
    '👩', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿',
    '🧑', '🧑🏻', '🧑🏼', '🧑🏽', '🧑🏾', '🧑🏿',
    // Fun characters
    '🦄', '🧜‍♀️', '🧜‍♂️', '🧚‍♀️', '🧚‍♂️', '🧙‍♀️', '🧙‍♂️',
    '👸', '🤴', '🦸‍♀️', '🦸‍♂️', '🧑‍🚀', '👨‍🚀', '👩‍🚀',
    '🤠', '👻', '🎅', '🧝‍♀️', '🧝‍♂️',
    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🦉', '🦆', '🐥', '🦄', '🐴',
    '🦓', '🐺', '🦝', '🦘', '🐘', '🦒', '🦩', '🦚'
  ];

  const badgeMilestones = [
    { points: 10, badge: '⭐' },
    { points: 20, badge: '👍' },
    { points: 50, badge: '🦄' },
    { points: 100, badge: '🧜‍♀️' },
    { points: 200, badge: '🦋' },
    { points: 500, badge: '🏈' },
    { points: 1000, badge: '⚽' },
    { points: 1500, badge: '🏆' },
    { points: 2000, badge: '👑' },
    { points: 2500, badge: '💎' },
    { points: 3000, badge: '🌟' },
    { points: 3500, badge: '🔥' },
    { points: 4000, badge: '⚡' },
    { points: 4500, badge: '🌈' },
    { points: 5000, badge: '🎯' }
  ];

  const calculateBadges = (earnedPoints) => {
    const badges = [];
    badgeMilestones.forEach(milestone => {
      if (earnedPoints >= milestone.points) {
        badges.push(milestone.badge);
      }
    });
    return badges;
  };

  const getNextBadge = (earnedPoints) => {
    for (let i = 0; i < badgeMilestones.length; i++) {
      if (earnedPoints < badgeMilestones[i].points) {
        return {
          badge: badgeMilestones[i].badge,
          points: badgeMilestones[i].points,
          remaining: badgeMilestones[i].points - earnedPoints
        };
      }
    }
    const nextMilestone = Math.ceil(earnedPoints / 500) * 500 + 500;
    return {
      badge: '🎖️',
      points: nextMilestone,
      remaining: nextMilestone - earnedPoints
    };
  };

  // Load data from localStorage on startup
  useEffect(() => {
    const loadData = () => {
      try {
        const savedKids = localStorage.getItem('kids');
        const savedMorningTasks = localStorage.getItem('morningTasks');
        const savedChores = localStorage.getItem('chores');
        const savedBedtimeTasks = localStorage.getItem('bedtimeTasks');
        const savedRewards = localStorage.getItem('rewards');
        const savedChoresCompleted = localStorage.getItem('choresCompleted');
        const savedMorningHistory = localStorage.getItem('morningHistory');
        const savedBedtimeHistory = localStorage.getItem('bedtimeHistory');
        const savedChoresHistory = localStorage.getItem('choresHistory');
        const savedDarkMode = localStorage.getItem('darkMode');
        const savedMorningUseCountdown = localStorage.getItem('morningUseCountdown');
        const savedMorningCountdownMinutes = localStorage.getItem('morningCountdownMinutes');
        const savedBedtimeUseCountdown = localStorage.getItem('bedtimeUseCountdown');
        const savedBedtimeCountdownMinutes = localStorage.getItem('bedtimeCountdownMinutes');

        if (savedKids) setKids(JSON.parse(savedKids));
        if (savedMorningTasks) setMorningTasks(JSON.parse(savedMorningTasks));
        if (savedChores) setChores(JSON.parse(savedChores));
        if (savedBedtimeTasks) setBedtimeTasks(JSON.parse(savedBedtimeTasks));
        if (savedRewards) setRewards(JSON.parse(savedRewards));
        if (savedChoresCompleted) setChoresCompleted(JSON.parse(savedChoresCompleted));
        if (savedMorningHistory) setMorningHistory(JSON.parse(savedMorningHistory));
        if (savedBedtimeHistory) setBedtimeHistory(JSON.parse(savedBedtimeHistory));
        if (savedChoresHistory) setChoresHistory(JSON.parse(savedChoresHistory));
        if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
        if (savedMorningUseCountdown) setMorningUseCountdown(JSON.parse(savedMorningUseCountdown));
        if (savedMorningCountdownMinutes) setMorningCountdownMinutes(JSON.parse(savedMorningCountdownMinutes));
        if (savedBedtimeUseCountdown) setBedtimeUseCountdown(JSON.parse(savedBedtimeUseCountdown));
        if (savedBedtimeCountdownMinutes) setBedtimeCountdownMinutes(JSON.parse(savedBedtimeCountdownMinutes));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('kids', JSON.stringify(kids));
  }, [kids]);

  useEffect(() => {
    localStorage.setItem('morningTasks', JSON.stringify(morningTasks));
  }, [morningTasks]);

  useEffect(() => {
    localStorage.setItem('chores', JSON.stringify(chores));
  }, [chores]);

  useEffect(() => {
    localStorage.setItem('bedtimeTasks', JSON.stringify(bedtimeTasks));
  }, [bedtimeTasks]);

  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('choresCompleted', JSON.stringify(choresCompleted));
  }, [choresCompleted]);

  useEffect(() => {
    localStorage.setItem('morningHistory', JSON.stringify(morningHistory));
  }, [morningHistory]);

  useEffect(() => {
    localStorage.setItem('bedtimeHistory', JSON.stringify(bedtimeHistory));
  }, [bedtimeHistory]);

  useEffect(() => {
    localStorage.setItem('choresHistory', JSON.stringify(choresHistory));
  }, [choresHistory]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('morningUseCountdown', JSON.stringify(morningUseCountdown));
  }, [morningUseCountdown]);

  useEffect(() => {
    localStorage.setItem('morningCountdownMinutes', JSON.stringify(morningCountdownMinutes));
  }, [morningCountdownMinutes]);

  useEffect(() => {
    localStorage.setItem('bedtimeUseCountdown', JSON.stringify(bedtimeUseCountdown));
  }, [bedtimeUseCountdown]);

  useEffect(() => {
    localStorage.setItem('bedtimeCountdownMinutes', JSON.stringify(bedtimeCountdownMinutes));
  }, [bedtimeCountdownMinutes]);

  // Android back button handler
  useEffect(() => {
    const handleBackButton = () => {
      if (currentActivity !== null) {
        setCurrentActivity(null);
        return false;
      }
      if (settingsSection !== 'main') {
        setSettingsSection('main');
        return false;
      }
      if (currentTab !== 'dashboard') {
        setCurrentTab('dashboard');
        return false;
      }
      // Only exit if we're at the root
      CapApp.exitApp();
    };

    const listener = CapApp.addListener('backButton', ({ canGoBack }) => {
      handleBackButton();
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [currentActivity, settingsSection, currentTab]);

  // Handle app going to background/foreground to keep timers running
  useEffect(() => {
    const handleAppStateChange = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        // App going to background - save current time
        setAppStateTime(Date.now());
      } else {
        // App coming to foreground - calculate elapsed time
        if (appStateTime) {
          const elapsed = Date.now() - appStateTime;
          
          // Update morning timer if active
          if (morningActive && morningStartTime) {
            setMorningTime(prevTime => prevTime + elapsed);
          }
          
          // Update bedtime timer if active
          if (bedtimeActive && bedtimeStartTime) {
            setBedtimeTime(prevTime => prevTime + elapsed);
          }
          
          setAppStateTime(null);
        }
      }
    });

    return () => {
      handleAppStateChange.then(l => l.remove());
    };
  }, [appStateTime, morningActive, bedtimeActive, morningStartTime, bedtimeStartTime]);

  useEffect(() => {
    if (morningActive) {
      morningIntervalRef.current = setInterval(() => {
        setMorningTime(t => t + 10);
      }, 10);
    } else {
      if (morningIntervalRef.current) {
        clearInterval(morningIntervalRef.current);
      }
    }
    return () => {
      if (morningIntervalRef.current) {
        clearInterval(morningIntervalRef.current);
      }
    };
  }, [morningActive]);

  useEffect(() => {
    if (bedtimeActive) {
      bedtimeIntervalRef.current = setInterval(() => {
        setBedtimeTime(t => t + 10);
      }, 10);
    } else {
      if (bedtimeIntervalRef.current) {
        clearInterval(bedtimeIntervalRef.current);
      }
    }
    return () => {
      if (bedtimeIntervalRef.current) {
        clearInterval(bedtimeIntervalRef.current);
      }
    };
  }, [bedtimeActive]);

  useEffect(() => {
    if (morningActive && currentActivity === 'morning') {
      const totalTasks = morningTasks.length * kids.length;
      const completedCount = Object.keys(morningCompleted).length;
      
      if (totalTasks > 0 && completedCount === totalTasks) {
        setMorningActive(false);
        
        const summary = calculateMorningSummary();
        const pointsAwarded = {};
        
        const fastestKidId = Object.entries(summary.kidTimes).reduce((min, entry) => {
          const kidId = entry[0];
          const time = entry[1];
          return time < min.time ? { kidId: parseInt(kidId), time } : min;
        }, { kidId: null, time: Infinity }).kidId;
        pointsAwarded[fastestKidId] = (pointsAwarded[fastestKidId] || 0) + 1;
        
        Object.values(summary.taskWinners).forEach(winner => {
          pointsAwarded[winner.kidId] = (pointsAwarded[winner.kidId] || 0) + 1;
        });
        
        setKids(kids.map(kid => ({
          ...kid,
          totalPoints: kid.totalPoints + (pointsAwarded[kid.id] || 0),
          earnedPoints: kid.earnedPoints + (pointsAwarded[kid.id] || 0)
        })));
        
        const historyEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          completed: morningCompleted,
          lapTimes: morningLapTimes,
          tasks: [...morningTasks],
          kidsSnapshot: kids.map(k => ({id: k.id, name: k.name, avatar: k.avatar})),
          pointsAwarded
        };
        setMorningHistory([historyEntry, ...morningHistory]);
        
        setMorningShowSummary(true);
      }
    }
  }, [morningCompleted, morningActive, currentActivity]);

  useEffect(() => {
    if (bedtimeActive && currentActivity === 'bedtime') {
      const totalTasks = bedtimeTasks.length * kids.length;
      const completedCount = Object.keys(bedtimeCompleted).length;
      
      if (totalTasks > 0 && completedCount === totalTasks) {
        setBedtimeActive(false);
        
        const summary = calculateBedtimeSummary();
        const pointsAwarded = {};
        
        const fastestKidId = Object.entries(summary.kidTimes).reduce((min, entry) => {
          const kidId = entry[0];
          const time = entry[1];
          return time < min.time ? { kidId: parseInt(kidId), time } : min;
        }, { kidId: null, time: Infinity }).kidId;
        pointsAwarded[fastestKidId] = (pointsAwarded[fastestKidId] || 0) + 1;
        
        Object.values(summary.taskWinners).forEach(winner => {
          pointsAwarded[winner.kidId] = (pointsAwarded[winner.kidId] || 0) + 1;
        });
        
        setKids(kids.map(kid => ({
          ...kid,
          totalPoints: kid.totalPoints + (pointsAwarded[kid.id] || 0),
          earnedPoints: kid.earnedPoints + (pointsAwarded[kid.id] || 0)
        })));
        
        const historyEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          completed: bedtimeCompleted,
          lapTimes: bedtimeLapTimes,
          tasks: [...bedtimeTasks],
          kidsSnapshot: kids.map(k => ({id: k.id, name: k.name, avatar: k.avatar})),
          pointsAwarded
        };
        setBedtimeHistory([historyEntry, ...bedtimeHistory]);
        
        setBedtimeShowSummary(true);
      }
    }
  }, [bedtimeCompleted, bedtimeActive, currentActivity]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const msec = Math.floor((ms % 1000) / 10);
    const minStr = min.toString().padStart(2, '0');
    const secStr = sec.toString().padStart(2, '0');
    const msecStr = msec.toString().padStart(2, '0');
    return minStr + ':' + secStr + '.' + msecStr;
  };

  const handleMorningTaskClick = (kidId, taskIdx) => {
    const key = kidId + '-' + taskIdx;
    if (morningCompleted[key]) return;

    // Find the most recently completed task for this kid (highest absoluteTime)
    let lastTime = 0;
    for (let i = 0; i < morningTasks.length; i++) {
      const prevKey = kidId + '-' + i;
      if (morningLapTimes[prevKey] && morningLapTimes[prevKey].absoluteTime > lastTime) {
        lastTime = morningLapTimes[prevKey].absoluteTime;
      }
    }

    const lapTime = morningTime - lastTime;
    const newCompleted = {...morningCompleted};
    newCompleted[key] = true;
    setMorningCompleted(newCompleted);
    
    const newLapTimes = {...morningLapTimes};
    newLapTimes[key] = {lapTime: lapTime, absoluteTime: morningTime};
    setMorningLapTimes(newLapTimes);
  };

  const startMorningRoutine = () => {
    setMorningActive(true);
    setMorningTime(0);
    setMorningCompleted({});
    setMorningLapTimes({});
    setMorningShowSummary(false);
    setMorningStartTime(Date.now());
  };

  const resetMorningRoutine = () => {
    setMorningActive(false);
    setMorningTime(0);
    setMorningCompleted({});
    setMorningLapTimes({});
    setMorningShowSummary(false);
    setMorningStartTime(null);
  };

  const calculateMorningSummary = () => {
    const kidTimes = {};
    const taskWinners = {};
    const countdownLimit = morningCountdownMinutes * 60 * 1000;

    kids.forEach(kid => {
      let totalTime = 0;
      let completedAll = true;
      morningTasks.forEach((task, idx) => {
        const key = kid.id + '-' + idx;
        if (morningLapTimes[key]) {
          totalTime = morningLapTimes[key].absoluteTime;
          if (!taskWinners[idx] || morningLapTimes[key].lapTime < taskWinners[idx].time) {
            taskWinners[idx] = { kidId: kid.id, time: morningLapTimes[key].lapTime };
          }
        } else {
          completedAll = false;
        }
      });
      
      // In countdown mode, if kid went over time or didn't complete all, they get disqualified
      if (morningUseCountdown && (totalTime > countdownLimit || !completedAll)) {
        kidTimes[kid.id] = Infinity; // Disqualified
      } else {
        kidTimes[kid.id] = totalTime;
      }
    });

    const fastestKid = Object.entries(kidTimes).reduce((min, entry) => {
      const kidId = entry[0];
      const time = entry[1];
      return time < min.time ? { kidId: parseInt(kidId), time } : min;
    }, { kidId: null, time: Infinity });

    // Count how many kids qualified
    const qualifiedKids = Object.values(kidTimes).filter(time => time !== Infinity).length;

    return { kidTimes, taskWinners, fastestKid, qualifiedKids };
  };

  const handleBedtimeTaskClick = (kidId, taskIdx) => {
    const key = kidId + '-' + taskIdx;
    if (bedtimeCompleted[key]) return;

    // Find the most recently completed task for this kid (highest absoluteTime)
    let lastTime = 0;
    for (let i = 0; i < bedtimeTasks.length; i++) {
      const prevKey = kidId + '-' + i;
      if (bedtimeLapTimes[prevKey] && bedtimeLapTimes[prevKey].absoluteTime > lastTime) {
        lastTime = bedtimeLapTimes[prevKey].absoluteTime;
      }
    }

    const lapTime = bedtimeTime - lastTime;
    const newCompleted = {...bedtimeCompleted};
    newCompleted[key] = true;
    setBedtimeCompleted(newCompleted);
    
    const newLapTimes = {...bedtimeLapTimes};
    newLapTimes[key] = {lapTime: lapTime, absoluteTime: bedtimeTime};
    setBedtimeLapTimes(newLapTimes);
  };

  const startBedtimeRoutine = () => {
    setBedtimeActive(true);
    setBedtimeTime(0);
    setBedtimeCompleted({});
    setBedtimeLapTimes({});
    setBedtimeShowSummary(false);
    setBedtimeStartTime(Date.now());
  };

  const resetBedtimeRoutine = () => {
    setBedtimeActive(false);
    setBedtimeTime(0);
    setBedtimeCompleted({});
    setBedtimeLapTimes({});
    setBedtimeShowSummary(false);
    setBedtimeStartTime(null);
  };

  const calculateBedtimeSummary = () => {
    const kidTimes = {};
    const taskWinners = {};
    const countdownLimit = bedtimeCountdownMinutes * 60 * 1000;

    kids.forEach(kid => {
      let totalTime = 0;
      let completedAll = true;
      bedtimeTasks.forEach((task, idx) => {
        const key = kid.id + '-' + idx;
        if (bedtimeLapTimes[key]) {
          totalTime = bedtimeLapTimes[key].absoluteTime;
          if (!taskWinners[idx] || bedtimeLapTimes[key].lapTime < taskWinners[idx].time) {
            taskWinners[idx] = { kidId: kid.id, time: bedtimeLapTimes[key].lapTime };
          }
        } else {
          completedAll = false;
        }
      });
      
      // In countdown mode, if kid went over time or didn't complete all, they get disqualified
      if (bedtimeUseCountdown && (totalTime > countdownLimit || !completedAll)) {
        kidTimes[kid.id] = Infinity; // Disqualified
      } else {
        kidTimes[kid.id] = totalTime;
      }
    });

    const fastestKid = Object.entries(kidTimes).reduce((min, entry) => {
      const kidId = entry[0];
      const time = entry[1];
      return time < min.time ? { kidId: parseInt(kidId), time } : min;
    }, { kidId: null, time: Infinity });

    // Count how many kids qualified
    const qualifiedKids = Object.values(kidTimes).filter(time => time !== Infinity).length;

    return { kidTimes, taskWinners, fastestKid, qualifiedKids };
  };

  const TabBar = () => (
    <div className={'fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 px-4 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')} style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <button onClick={() => setCurrentTab('dashboard')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'dashboard' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Home size={24} /><span className="text-xs mt-1">Kids</span>
      </button>
      <button onClick={() => setCurrentTab('rewards')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'rewards' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Award size={24} /><span className="text-xs mt-1">Rewards</span>
      </button>
      <button onClick={() => setCurrentTab('activities')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'activities' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <CheckSquare size={24} /><span className="text-xs mt-1">Tasks</span>
      </button>
      <button onClick={() => setCurrentTab('settings')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'settings' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Settings size={24} /><span className="text-xs mt-1">Parent</span>
      </button>
    </div>
  );

  const DashboardPage = () => (
    <div className="p-6 pb-24 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className={'text-3xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Kids Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowInstructions(true)} 
            className={'p-3 rounded-lg font-bold text-lg ' + (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600')}
          >
            ?
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={'p-3 rounded-lg ' + (darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700')}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {kids.map(kid => {
          const earnedBadges = calculateBadges(kid.earnedPoints);
          const nextBadge = getNextBadge(kid.earnedPoints);
          return (
            <div key={kid.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-6 border-2'}>
              <div className="flex items-center mb-4">
                <div className="text-6xl mr-4">{kid.avatar}</div>
                <div className="flex-1">
                  <h2 className={'text-2xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</h2>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <span className={'text-sm mr-2 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Current Points:</span>
                      <span className="text-lg font-bold text-green-600">{kid.totalPoints}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={'text-sm mr-2 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Total Earned:</span>
                      <span className="text-lg font-semibold text-blue-600">{kid.earnedPoints}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className={'text-sm font-semibold mb-2 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Badges Earned ({earnedBadges.length}):</p>
                <div className="flex gap-2 flex-wrap">
                  {earnedBadges.map((badge, idx) => (
                    <div key={idx} className="text-4xl">{badge}</div>
                  ))}
                </div>
              </div>
              
              <div className={(darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200') + ' mt-4 rounded-lg p-3 border-2'}>
                <p className={'text-xs font-semibold mb-1 ' + (darkMode ? 'text-purple-300' : 'text-purple-700')}>Next Badge:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{nextBadge.badge}</span>
                    <span className={'text-sm ' + (darkMode ? 'text-purple-300' : 'text-purple-700')}>at {nextBadge.points} points</span>
                  </div>
                  <span className={'text-sm font-bold ' + (darkMode ? 'text-purple-400' : 'text-purple-600')}>{nextBadge.remaining} more!</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ActivitiesPage = () => {
    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
    const subTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';
    
    return (
      <div className="p-6 pb-24 pt-12">
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Activities</h1>
        <div className="space-y-4">
          <button onClick={() => setCurrentActivity('morning')} className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl shadow-lg p-8 border-2 border-yellow-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="text-7xl mr-6">🌅</div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">Morning</h2>
                <p className="text-gray-600 text-sm mt-1">Getting ready for school</p>
              </div>
            </div>
          </button>
          <button onClick={() => setCurrentActivity('chores')} className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-lg p-8 border-2 border-purple-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="text-7xl mr-6">🛏️</div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">Chores & Homework</h2>
                <p className="text-gray-600 text-sm mt-1">Daily tasks and study time</p>
              </div>
            </div>
          </button>
          <button onClick={() => setCurrentActivity('bedtime')} className="w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg p-8 border-2 border-blue-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="text-7xl mr-6">🌙</div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-800">Bedtime</h2>
                <p className="text-gray-600 text-sm mt-1">Getting ready for bed</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const MorningRoutinePage = () => {
    if (morningShowSummary) {
      const summary = calculateMorningSummary();
      const graphData = kids.map(kid => {
        const points = [{x: 0, y: 0}];
        morningTasks.forEach((task, idx) => {
          const key = kid.id + '-' + idx;
          if (morningLapTimes[key]) {
            const cumTime = morningLapTimes[key].absoluteTime;
            points.push({x: idx + 1, y: cumTime / 1000});
          }
        });
        return {kidId: kid.id, name: kid.name, avatar: kid.avatar, points};
      });
      const maxTime = Math.max(...graphData.flatMap(d => d.points.map(p => p.y)));
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
      
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Morning Summary 🎉</h1>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {morningUseCountdown ? 'Results (Countdown Mode)' : 'Overall Winner'}
            </h2>
            {morningUseCountdown ? (
              <div className="space-y-3">
                {kids.map(kid => {
                  const kidTime = summary.kidTimes[kid.id];
                  const isQualified = kidTime !== Infinity;
                  const isWinner = kid.id === summary.fastestKid.kidId;
                  
                  return (
                    <div key={kid.id} className={'flex items-center gap-4 p-4 rounded-lg border-2 ' + (isQualified ? (isWinner ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-200') : 'bg-red-50 border-red-200')}>
                      <div className="text-4xl">{kid.avatar}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{kid.name}</h3>
                        {isQualified ? (
                          <>
                            <p className="text-gray-600">Finished in {formatTime(kidTime)}</p>
                            <p className={'font-bold ' + (isWinner ? 'text-green-600' : 'text-blue-600')}>
                              {isWinner ? `+${Math.ceil(kids.length / summary.qualifiedKids)} Points! 🏆` : `+${Math.floor(kids.length / summary.qualifiedKids)} Points`}
                            </p>
                          </>
                        ) : (
                          <p className="text-red-600 font-bold">Over time - No points ❌</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              kids.map(kid => kid.id === summary.fastestKid.kidId && (
                <div key={kid.id} className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                  <div className="text-5xl">{kid.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{kid.name}</h3>
                    <p className="text-gray-600">Finished in {formatTime(summary.kidTimes[kid.id])}</p>
                    <p className="text-green-600 font-bold">+1 Point! 🏆</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Winners</h2>
            <div className="space-y-2">
              {morningTasks.map((task, idx) => {
                const winner = summary.taskWinners[idx];
                if (!winner) return null;
                const kid = kids.find(k => k.id === winner.kidId);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{kid.avatar}</span>
                      <div>
                        <p className="font-semibold">{task}</p>
                        <p className="text-sm text-gray-600">{kid.name} - {formatTime(winner.time)}</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">+1 pt</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Progress Chart</h2>
            <div className="relative h-64 bg-gray-50 rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 600 200">
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="50" y1={10 + i * 45} x2="580" y2={10 + i * 45} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4].map(i => {
                  const val = (maxTime * (4 - i) / 4).toFixed(0);
                  return <text key={i} x="35" y={15 + i * 45} fontSize="10" fill="#6B7280" textAnchor="end">{val}s</text>;
                })}
                {morningTasks.map((task, idx) => (
                  <text key={idx} x={50 + (idx + 1) * (530 / (morningTasks.length + 1))} y="195" fontSize="9" fill="#6B7280" textAnchor="middle">{task.substring(0, 8)}</text>
                ))}
                {graphData.map((kidData, kidIdx) => {
                  const color = colors[kidIdx % colors.length];
                  const pathData = kidData.points.map((p, i) => {
                    const x = 50 + p.x * (530 / (morningTasks.length + 1));
                    const y = 190 - (p.y / maxTime) * 180;
                    return (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y;
                  }).join(' ');
                  return (
                    <g key={kidData.kidId}>
                      <path d={pathData} fill="none" stroke={color} strokeWidth="3" />
                      {kidData.points.map((p, i) => {
                        const x = 50 + p.x * (530 / (morningTasks.length + 1));
                        const y = 190 - (p.y / maxTime) * 180;
                        return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex gap-4 mt-4 justify-center flex-wrap">
              {graphData.map((kidData, idx) => (
                <div key={kidData.kidId} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: colors[idx % colors.length]}}></div>
                  <span className="text-sm font-semibold">{kidData.avatar} {kidData.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={resetMorningRoutine} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2 mb-4">
            <RotateCcw size={24} />Start New Morning Routine
          </button>
          {morningHistory.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Sessions</h2>
              <div className="space-y-3">
                {morningHistory.map(entry => {
                  const entryDate = new Date(entry.date);
                  return (
                    <div key={entry.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{entryDate.toLocaleDateString()} at {entryDate.toLocaleTimeString()}</p>
                          <p className="text-sm text-gray-600">
                            Points: {Object.entries(entry.pointsAwarded).map(item => {
                              const kidId = item[0];
                              const pts = item[1];
                              const kid = entry.kidsSnapshot.find(k => k.id === parseInt(kidId));
                              return kid.name + ': +' + pts;
                            }).join(', ')}
                          </p>
                        </div>
                        <button onClick={() => {
                          setKids(kids.map(kid => {
                            const pointsToRemove = entry.pointsAwarded[kid.id] || 0;
                            return {...kid, totalPoints: kid.totalPoints - pointsToRemove, earnedPoints: kid.earnedPoints - pointsToRemove};
                          }));
                          setMorningHistory(morningHistory.filter(h => h.id !== entry.id));
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-6 pb-24 pt-12">
        <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Morning Routine 🌅</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="text-center mb-4">
            {morningUseCountdown ? (
              <>
                <div className={'text-5xl font-bold mb-2 ' + (morningTime > morningCountdownMinutes * 60 * 1000 ? 'text-red-600' : 'text-blue-600')}>
                  {formatTime(Math.max(0, morningCountdownMinutes * 60 * 1000 - morningTime))}
                </div>
                <p className="text-sm text-gray-600">
                  {morningTime > morningCountdownMinutes * 60 * 1000 ? '⏰ Time\'s up!' : `⏱️ ${morningCountdownMinutes} min countdown`}
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl font-bold text-blue-600 mb-2">{formatTime(morningTime)}</div>
                <p className="text-sm text-gray-600">⏱️ Stopwatch mode</p>
              </>
            )}
            <div className="flex gap-2 justify-center mt-4">
              {!morningActive && morningTime === 0 && (
                <button onClick={startMorningRoutine} className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <Play size={20} />Start
                </button>
              )}
              {morningActive && (
                <button onClick={() => setMorningActive(false)} className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 flex items-center gap-2">
                  <Pause size={20} />Pause
                </button>
              )}
              {!morningActive && morningTime > 0 && (
                <button onClick={() => setMorningActive(true)} className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <Play size={20} />Resume
                </button>
              )}
              {morningTime > 0 && (
                <button onClick={resetMorningRoutine} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 flex items-center gap-2">
                  <RotateCcw size={20} />Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left font-bold text-gray-700 border-b-2">Task</th>
                {kids.map(kid => (
                  <th key={kid.id} className="p-2 text-center font-bold text-gray-700 border-b-2">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-1">{kid.avatar}</div>
                      <div className="text-sm">{kid.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {morningTasks.map((task, taskIdx) => (
                <tr key={taskIdx} className="border-b">
                  <td className="p-2 font-semibold text-gray-700">{task}</td>
                  {kids.map(kid => {
                    const key = kid.id + '-' + taskIdx;
                    const isCompleted = morningCompleted[key];
                    const lapTime = morningLapTimes[key];
                    return (
                      <td key={kid.id} className="p-2">
                        {isCompleted ? (
                          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-2 text-center">
                            <div className="text-2xl mb-1">✓</div>
                            <div className="text-xs font-bold text-green-700">{formatTime(lapTime.lapTime)}</div>
                          </div>
                        ) : (
                          <button onClick={() => handleMorningTaskClick(kid.id, taskIdx)} disabled={!morningActive} className={'w-full p-4 rounded-lg border-2 ' + (morningActive ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' : 'bg-gray-100 border-gray-300 cursor-not-allowed')}>
                            ○
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ChoresPage = () => {
    const handleChoreToggle = (kidId, choreId) => {
      const key = kidId + '-' + choreId;
      const chore = chores.find(c => c.id === choreId);
      const isCurrentlyCompleted = choresCompleted[key];
      
      const newCompleted = {...choresCompleted};
      newCompleted[key] = !isCurrentlyCompleted;
      setChoresCompleted(newCompleted);
      
      if (isCurrentlyCompleted) {
        setKids(kids.map(k => k.id === kidId ? {...k, totalPoints: k.totalPoints - chore.points, earnedPoints: k.earnedPoints - chore.points} : k));
      } else {
        setKids(kids.map(k => k.id === kidId ? {...k, totalPoints: k.totalPoints + chore.points, earnedPoints: k.earnedPoints + chore.points} : k));
      }
    };

    const saveToHistory = () => {
      const pointsAwarded = {};
      kids.forEach(kid => {
        let totalPoints = 0;
        chores.forEach(chore => {
          const key = kid.id + '-' + chore.id;
          if (choresCompleted[key]) {
            totalPoints += chore.points;
          }
        });
        if (totalPoints > 0) {
          pointsAwarded[kid.id] = totalPoints;
        }
      });
      
      const historyEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        completed: {...choresCompleted},
        choresSnapshot: chores.map(c => ({id: c.id, name: c.name, points: c.points})),
        kidsSnapshot: kids.map(k => ({id: k.id, name: k.name, avatar: k.avatar})),
        pointsAwarded
      };
      setChoresHistory([historyEntry, ...choresHistory]);
      setChoresCompleted({});
    };

    return (
      <div className="p-6 pb-24 pt-12">
        <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Chores & Homework 🛏️</h1>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left font-bold text-gray-700 border-b-2">Chore</th>
                <th className="p-2 text-center font-bold text-gray-700 border-b-2">Points</th>
                {kids.map(kid => (
                  <th key={kid.id} className="p-2 text-center font-bold text-gray-700 border-b-2">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-1">{kid.avatar}</div>
                      <div className="text-sm">{kid.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chores.map((chore) => (
                <tr key={chore.id} className="border-b">
                  <td className="p-2 font-semibold text-gray-700">{chore.name}</td>
                  <td className="p-2 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-bold">
                      {chore.points} pts
                    </span>
                  </td>
                  {kids.map(kid => {
                    const key = kid.id + '-' + chore.id;
                    const isCompleted = choresCompleted[key];
                    return (
                      <td key={kid.id} className="p-2">
                        <button
                          onClick={() => handleChoreToggle(kid.id, chore.id)}
                          className={'w-full p-4 rounded-lg border-2 ' + (isCompleted ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100')}
                        >
                          {isCompleted ? (
                            <div className="text-3xl">✓</div>
                          ) : (
                            <div className="text-2xl text-gray-400">○</div>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={saveToHistory}
          disabled={Object.keys(choresCompleted).length === 0}
          className={'w-full rounded-xl p-4 font-bold flex items-center justify-center gap-2 mb-4 ' + (Object.keys(choresCompleted).length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed')}
        >
          <CheckSquare size={24} />
          Save to History & Reset
        </button>
        
        {choresHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Sessions</h2>
            <div className="space-y-3">
              {choresHistory.map(entry => {
                const entryDate = new Date(entry.date);
                return (
                  <div key={entry.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{entryDate.toLocaleDateString()} at {entryDate.toLocaleTimeString()}</p>
                        <p className="text-sm text-gray-600">
                          Points: {Object.entries(entry.pointsAwarded).map(item => {
                            const kidId = item[0];
                            const pts = item[1];
                            const kid = entry.kidsSnapshot.find(k => k.id === parseInt(kidId));
                            return kid.name + ': +' + pts;
                          }).join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setKids(kids.map(kid => {
                            const pointsToRemove = entry.pointsAwarded[kid.id] || 0;
                            return {...kid, totalPoints: kid.totalPoints - pointsToRemove, earnedPoints: kid.earnedPoints - pointsToRemove};
                          }));
                          setChoresHistory(choresHistory.filter(h => h.id !== entry.id));
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const BedtimeRoutinePage = () => {
    if (bedtimeShowSummary) {
      const summary = calculateBedtimeSummary();
      const graphData = kids.map(kid => {
        const points = [{x: 0, y: 0}];
        bedtimeTasks.forEach((task, idx) => {
          const key = kid.id + '-' + idx;
          if (bedtimeLapTimes[key]) {
            const cumTime = bedtimeLapTimes[key].absoluteTime;
            points.push({x: idx + 1, y: cumTime / 1000});
          }
        });
        return {kidId: kid.id, name: kid.name, avatar: kid.avatar, points};
      });
      const maxTime = Math.max(...graphData.flatMap(d => d.points.map(p => p.y)));
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
      
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Bedtime Summary 🎉</h1>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {bedtimeUseCountdown ? 'Results (Countdown Mode)' : 'Overall Winner'}
            </h2>
            {bedtimeUseCountdown ? (
              <div className="space-y-3">
                {kids.map(kid => {
                  const kidTime = summary.kidTimes[kid.id];
                  const isQualified = kidTime !== Infinity;
                  const isWinner = kid.id === summary.fastestKid.kidId;
                  
                  return (
                    <div key={kid.id} className={'flex items-center gap-4 p-4 rounded-lg border-2 ' + (isQualified ? (isWinner ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-200') : 'bg-red-50 border-red-200')}>
                      <div className="text-4xl">{kid.avatar}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{kid.name}</h3>
                        {isQualified ? (
                          <>
                            <p className="text-gray-600">Finished in {formatTime(kidTime)}</p>
                            <p className={'font-bold ' + (isWinner ? 'text-green-600' : 'text-blue-600')}>
                              {isWinner ? `+${Math.ceil(kids.length / summary.qualifiedKids)} Points! 🏆` : `+${Math.floor(kids.length / summary.qualifiedKids)} Points`}
                            </p>
                          </>
                        ) : (
                          <p className="text-red-600 font-bold">Over time - No points ❌</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              kids.map(kid => kid.id === summary.fastestKid.kidId && (
                <div key={kid.id} className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                  <div className="text-5xl">{kid.avatar}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{kid.name}</h3>
                    <p className="text-gray-600">Finished in {formatTime(summary.kidTimes[kid.id])}</p>
                    <p className="text-green-600 font-bold">+1 Point! 🏆</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Winners</h2>
            <div className="space-y-2">
              {bedtimeTasks.map((task, idx) => {
                const winner = summary.taskWinners[idx];
                if (!winner) return null;
                const kid = kids.find(k => k.id === winner.kidId);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{kid.avatar}</span>
                      <div>
                        <p className="font-semibold">{task}</p>
                        <p className="text-sm text-gray-600">{kid.name} - {formatTime(winner.time)}</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">+1 pt</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Progress Chart</h2>
            <div className="relative h-64 bg-gray-50 rounded-lg p-4">
              <svg className="w-full h-full" viewBox="0 0 600 200">
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="50" y1={10 + i * 45} x2="580" y2={10 + i * 45} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4].map(i => {
                  const val = (maxTime * (4 - i) / 4).toFixed(0);
                  return <text key={i} x="35" y={15 + i * 45} fontSize="10" fill="#6B7280" textAnchor="end">{val}s</text>;
                })}
                {bedtimeTasks.map((task, idx) => (
                  <text key={idx} x={50 + (idx + 1) * (530 / (bedtimeTasks.length + 1))} y="195" fontSize="9" fill="#6B7280" textAnchor="middle">{task.substring(0, 8)}</text>
                ))}
                {graphData.map((kidData, kidIdx) => {
                  const color = colors[kidIdx % colors.length];
                  const pathData = kidData.points.map((p, i) => {
                    const x = 50 + p.x * (530 / (bedtimeTasks.length + 1));
                    const y = 190 - (p.y / maxTime) * 180;
                    return (i === 0 ? 'M' : 'L') + ' ' + x + ' ' + y;
                  }).join(' ');
                  return (
                    <g key={kidData.kidId}>
                      <path d={pathData} fill="none" stroke={color} strokeWidth="3" />
                      {kidData.points.map((p, i) => {
                        const x = 50 + p.x * (530 / (bedtimeTasks.length + 1));
                        const y = 190 - (p.y / maxTime) * 180;
                        return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex gap-4 mt-4 justify-center flex-wrap">
              {graphData.map((kidData, idx) => (
                <div key={kidData.kidId} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: colors[idx % colors.length]}}></div>
                  <span className="text-sm font-semibold">{kidData.avatar} {kidData.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={resetBedtimeRoutine} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2 mb-4">
            <RotateCcw size={24} />Start New Bedtime Routine
          </button>
          {bedtimeHistory.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Sessions</h2>
              <div className="space-y-3">
                {bedtimeHistory.map(entry => {
                  const entryDate = new Date(entry.date);
                  return (
                    <div key={entry.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{entryDate.toLocaleDateString()} at {entryDate.toLocaleTimeString()}</p>
                          <p className="text-sm text-gray-600">
                            Points: {Object.entries(entry.pointsAwarded).map(item => {
                              const kidId = item[0];
                              const pts = item[1];
                              const kid = entry.kidsSnapshot.find(k => k.id === parseInt(kidId));
                              return kid.name + ': +' + pts;
                            }).join(', ')}
                          </p>
                        </div>
                        <button onClick={() => {
                          setKids(kids.map(kid => {
                            const pointsToRemove = entry.pointsAwarded[kid.id] || 0;
                            return {...kid, totalPoints: kid.totalPoints - pointsToRemove, earnedPoints: kid.earnedPoints - pointsToRemove};
                          }));
                          setBedtimeHistory(bedtimeHistory.filter(h => h.id !== entry.id));
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-6 pb-24 pt-12">
        <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bedtime Routine 🌙</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="text-center mb-4">
            {bedtimeUseCountdown ? (
              <>
                <div className={'text-5xl font-bold mb-2 ' + (bedtimeTime > bedtimeCountdownMinutes * 60 * 1000 ? 'text-red-600' : 'text-blue-600')}>
                  {formatTime(Math.max(0, bedtimeCountdownMinutes * 60 * 1000 - bedtimeTime))}
                </div>
                <p className="text-sm text-gray-600">
                  {bedtimeTime > bedtimeCountdownMinutes * 60 * 1000 ? '⏰ Time\'s up!' : `⏱️ ${bedtimeCountdownMinutes} min countdown`}
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl font-bold text-blue-600 mb-2">{formatTime(bedtimeTime)}</div>
                <p className="text-sm text-gray-600">⏱️ Stopwatch mode</p>
              </>
            )}
            <div className="flex gap-2 justify-center mt-4">
              {!bedtimeActive && bedtimeTime === 0 && (
                <button onClick={startBedtimeRoutine} className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <Play size={20} />Start
                </button>
              )}
              {bedtimeActive && (
                <button onClick={() => setBedtimeActive(false)} className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 flex items-center gap-2">
                  <Pause size={20} />Pause
                </button>
              )}
              {!bedtimeActive && bedtimeTime > 0 && (
                <button onClick={() => setBedtimeActive(true)} className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <Play size={20} />Resume
                </button>
              )}
              {bedtimeTime > 0 && (
                <button onClick={resetBedtimeRoutine} className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 flex items-center gap-2">
                  <RotateCcw size={20} />Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left font-bold text-gray-700 border-b-2">Task</th>
                {kids.map(kid => (
                  <th key={kid.id} className="p-2 text-center font-bold text-gray-700 border-b-2">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-1">{kid.avatar}</div>
                      <div className="text-sm">{kid.name}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bedtimeTasks.map((task, taskIdx) => (
                <tr key={taskIdx} className="border-b">
                  <td className="p-2 font-semibold text-gray-700">{task}</td>
                  {kids.map(kid => {
                    const key = kid.id + '-' + taskIdx;
                    const isCompleted = bedtimeCompleted[key];
                    const lapTime = bedtimeLapTimes[key];
                    return (
                      <td key={kid.id} className="p-2">
                        {isCompleted ? (
                          <div className="bg-green-100 border-2 border-green-400 rounded-lg p-2 text-center">
                            <div className="text-2xl mb-1">✓</div>
                            <div className="text-xs font-bold text-green-700">{formatTime(lapTime.lapTime)}</div>
                          </div>
                        ) : (
                          <button onClick={() => handleBedtimeTaskClick(kid.id, taskIdx)} disabled={!bedtimeActive} className={'w-full p-4 rounded-lg border-2 ' + (bedtimeActive ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' : 'bg-gray-100 border-gray-300 cursor-not-allowed')}>
                            ○
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const RewardsPage = () => (
    <div className="p-6 pb-24 pt-12">
      <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Rewards</h1>
      <p className={'mb-4 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Spend your points on fun rewards!</p>
      <div className="space-y-3">
        {rewards.filter(r => r.enabled).map(reward => (
          <button
            key={reward.id}
            onClick={() => {
              if (reward.cost) {
                setSelectedReward(reward);
                setShowRewardModal(true);
              }
            }}
            className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="text-5xl mr-4">{reward.icon}</div>
                <div className="text-left">
                  <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{reward.name}</h3>
                  <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{reward.description}</p>
                </div>
              </div>
              {reward.cost && (
                <div className="ml-4 flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600">{reward.cost}</span>
                  <span className="text-xs text-gray-500">points</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {showRewardModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRewardModal(false)}>
          <div className={(darkMode ? 'bg-gray-800' : 'bg-white') + ' rounded-2xl p-6 max-w-md w-full mx-4'} onClick={(e) => e.stopPropagation()}>
            <h2 className={'text-2xl font-bold mb-4 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Select Kid</h2>
            <p className={'mb-4 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Who is redeeming {selectedReward.name} for {selectedReward.cost} points?</p>
            <div className="space-y-2 mb-6">
              {kids.map(kid => {
                const canAfford = kid.totalPoints >= selectedReward.cost;
                return (
                  <button
                    key={kid.id}
                    onClick={() => {
                      if (canAfford) {
                        setSelectedKidForReward(kid);
                        setShowConfirmModal(true);
                      }
                    }}
                    disabled={!canAfford}
                    className={'w-full flex items-center justify-between p-4 rounded-lg border-2 ' + (canAfford ? (darkMode ? 'bg-gray-700 border-blue-500 hover:bg-gray-600' : 'bg-white border-blue-300 hover:bg-blue-50') : (darkMode ? 'bg-gray-900 border-gray-700 cursor-not-allowed opacity-60' : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{kid.avatar}</div>
                      <div className="text-left">
                        <p className={'font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</p>
                        <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{kid.totalPoints} points</p>
                      </div>
                    </div>
                    {canAfford ? (
                      <div className="text-green-600 font-bold">✓ Can afford</div>
                    ) : (
                      <div className="text-red-600 font-bold text-sm">Not enough points</div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                setShowRewardModal(false);
                setSelectedReward(null);
              }}
              className={(darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400') + ' w-full rounded-xl p-3 font-bold'}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {showConfirmModal && selectedReward && selectedKidForReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConfirmModal(false)}>
          <div className={(darkMode ? 'bg-gray-800' : 'bg-white') + ' rounded-2xl p-6 max-w-md w-full mx-4'} onClick={(e) => e.stopPropagation()}>
            <h2 className={'text-2xl font-bold mb-4 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Confirm Purchase</h2>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{selectedKidForReward.avatar}</div>
                <div>
                  <p className={'font-bold text-lg ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{selectedKidForReward.name}</p>
                  <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Current: {selectedKidForReward.totalPoints} points</p>
                </div>
              </div>
              <div className={(darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200') + ' rounded-lg p-4 border-2'}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">{selectedReward.icon}</div>
                  <div>
                    <p className={'font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{selectedReward.name}</p>
                    <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{selectedReward.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                  <span className={'font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Cost:</span>
                  <span className="text-red-600 font-bold text-xl">-{selectedReward.cost} points</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={'font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>New Balance:</span>
                  <span className="text-green-600 font-bold text-xl">{selectedKidForReward.totalPoints - selectedReward.cost} points</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setKids(kids.map(k => k.id === selectedKidForReward.id ? {...k, totalPoints: k.totalPoints - selectedReward.cost} : k));
                  setShowConfirmModal(false);
                  setShowRewardModal(false);
                  setSelectedReward(null);
                  setSelectedKidForReward(null);
                }}
                className="flex-1 bg-green-500 text-white rounded-xl p-3 font-bold hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedKidForReward(null);
                }}
                className={(darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400') + ' flex-1 rounded-xl p-3 font-bold'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const SettingsPage = () => {
    const handleAddKid = () => {
      const newId = Math.max(...kids.map(k => k.id), 0) + 1;
      setKids([...kids, { id: newId, name: 'New Kid', avatar: '👶', totalPoints: 0, earnedPoints: 0 }]);
    };

    if (settingsSection === 'main') {
      return (
        <div className="p-6 pb-24 pt-12">
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Settings</h1>
          <div className="space-y-3">
            <button onClick={() => setSettingsSection('kids')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>👨‍👩‍👧‍👦 Manage Kids</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Add, remove, or edit kids names and avatars</p>
            </button>
            <button onClick={() => setSettingsSection('adjustpoints')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>➕➖ Adjust Points</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Manually add or remove points</p>
            </button>
            <button onClick={() => setSettingsSection('morning')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>🌅 Morning Tasks</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Edit morning routine tasks</p>
            </button>
            <button onClick={() => setSettingsSection('chores')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>🛏️ Chores & Homework</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Edit chores and point values</p>
            </button>
            <button onClick={() => setSettingsSection('bedtime')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>🌙 Bedtime Tasks</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Edit bedtime routine tasks</p>
            </button>
            <button onClick={() => setSettingsSection('rewards')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>🏅 Rewards</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Enable/disable and edit rewards</p>
            </button>
          </div>
        </div>
      );
    }

    if (settingsSection === 'kids') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Manage Kids</h1>
          <div className="space-y-4 mb-6">
            {kids.map(kid => (
              <div key={kid.id} className={'rounded-xl shadow-lg p-5 border-2 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingKidId(kid.id);
                      setShowAvatarPicker(true);
                    }}
                    className={'text-5xl border-2 rounded-lg p-2 hover:bg-gray-100 ' + (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-transparent border-gray-200')}
                  >
                    {kid.avatar}
                  </button>
                  <input
                    type="text"
                    defaultValue={kid.name}
                    onBlur={(e) => setKids(kids.map(k => k.id === kid.id ? {...k, name: e.target.value} : k))}
                    className={'flex-1 text-xl font-bold p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')}
                  />
                  <button onClick={() => setKids(kids.filter(k => k.id !== kid.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={24} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddKid} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} /> Add Kid
          </button>
          
          {showAvatarPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={'rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <h2 className={'text-xl font-bold mb-4 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Choose Avatar</h2>
                <div className="grid grid-cols-8 gap-2 mb-4">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setKids(kids.map(k => k.id === editingKidId ? {...k, avatar} : k));
                        setShowAvatarPicker(false);
                        setEditingKidId(null);
                      }}
                      className={'text-4xl p-2 rounded-lg transition-colors ' + (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowAvatarPicker(false);
                    setEditingKidId(null);
                  }}
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (settingsSection === 'adjustpoints') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Adjust Points</h1>
          <div className="space-y-4">
            {kids.map(kid => (
              <div key={kid.id} className={'rounded-xl shadow-lg p-5 border-2 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
                <div className="flex items-center mb-4">
                  <span className="text-5xl mr-4">{kid.avatar}</span>
                  <div>
                    <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</h3>
                    <p className={'text-sm ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Current: <span className="font-bold text-green-600">{kid.totalPoints}</span> points</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setKids(kids.map(k => k.id === kid.id ? {...k, totalPoints: k.totalPoints - 1, earnedPoints: Math.max(0, k.earnedPoints - 1)} : k))}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    ➖ Remove 1
                  </button>
                  <button
                    onClick={() => setKids(kids.map(k => k.id === kid.id ? {...k, totalPoints: k.totalPoints + 1, earnedPoints: k.earnedPoints + 1} : k))}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    ➕ Add 1
                  </button>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setKids(kids.map(k => k.id === kid.id ? {...k, totalPoints: k.totalPoints - 5, earnedPoints: Math.max(0, k.earnedPoints - 5)} : k))}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
                  >
                    ➖ 5
                  </button>
                  <button
                    onClick={() => setKids(kids.map(k => k.id === kid.id ? {...k, totalPoints: k.totalPoints + 5, earnedPoints: k.earnedPoints + 5} : k))}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                  >
                    ➕ 5
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (settingsSection === 'morning') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Morning Tasks</h1>
          
          {/* Countdown Timer Settings */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2 mb-6'}>
            <h2 className={'text-lg font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>⏱️ Timer Mode</h2>
            <label className="flex items-center gap-3 mb-3">
              <input 
                type="checkbox" 
                checked={morningUseCountdown}
                onChange={(e) => setMorningUseCountdown(e.target.checked)}
                className="w-5 h-5" 
              />
              <span className={'font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Use countdown timer
              </span>
            </label>
            {morningUseCountdown && (
              <div className="flex items-center gap-3">
                <label className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>Time limit:</label>
                <button
                  onClick={() => setMorningCountdownMinutes(Math.max(1, morningCountdownMinutes - 1))}
                  className={(darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600') + ' text-white px-3 py-2 rounded-lg font-bold'}
                >
                  ➖
                </button>
                <span className={'font-bold text-xl min-w-[3rem] text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                  {morningCountdownMinutes}
                </span>
                <button
                  onClick={() => setMorningCountdownMinutes(morningCountdownMinutes + 1)}
                  className={(darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600') + ' text-white px-3 py-2 rounded-lg font-bold'}
                >
                  ➕
                </button>
                <span className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>minutes</span>
              </div>
            )}
            <p className={'text-sm mt-3 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>
              {morningUseCountdown 
                ? '⏱️ Countdown: Kids must finish before time runs out or get 0 points!'
                : '⏱️ Stopwatch: Tracks speed, fastest kids earn bonus points'}
            </p>
          </div>
          
          <div className="space-y-2 mb-6">
            {morningTasks.map((task, idx) => (
              <div key={idx} className={'rounded-lg shadow p-3 flex items-center gap-2 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { if (idx > 0) { const n = [...morningTasks]; [n[idx], n[idx - 1]] = [n[idx - 1], n[idx]]; setMorningTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronUp size={16} /></button>
                  <button onClick={() => { if (idx < morningTasks.length - 1) { const n = [...morningTasks]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setMorningTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronDown size={16} /></button>
                </div>
                <input
                  type="text"
                  defaultValue={task}
                  key={`morning-${idx}`}
                  onBlur={(e) => { const n = [...morningTasks]; n[idx] = e.target.value; setMorningTasks(n); }}
                  className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')}
                />
                <button onClick={() => setMorningTasks(morningTasks.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setMorningTasks([...morningTasks, 'New Task'])} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} /> Add Task
          </button>
        </div>
      );
    }

    if (settingsSection === 'chores') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Chores & Homework</h1>
          <div className="space-y-2 mb-6">
            {chores.map((chore) => (
              <div key={chore.id} className={'rounded-lg shadow p-3 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    defaultValue={chore.name}
                    key={`chore-${chore.id}`}
                    onBlur={(e) => setChores(chores.map(c => c.id === chore.id ? {...c, name: e.target.value} : c))}
                    className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')}
                  />
                  <button onClick={() => setChores(chores.filter(c => c.id !== chore.id))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span className={'text-sm font-semibold ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Points:</span>
                  <button
                    onClick={() => setChores(chores.map(c => c.id === chore.id ? {...c, points: Math.max(1, c.points - 1)} : c))}
                    className={(darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600') + ' text-white px-3 py-1 rounded font-bold'}
                  >
                    ➖
                  </button>
                  <span className={'font-bold text-lg min-w-[3rem] text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{chore.points}</span>
                  <button
                    onClick={() => setChores(chores.map(c => c.id === chore.id ? {...c, points: c.points + 1} : c))}
                    className={(darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600') + ' text-white px-3 py-1 rounded font-bold'}
                  >
                    ➕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { const newId = Math.max(...chores.map(c => c.id), 0) + 1; setChores([...chores, { id: newId, name: 'New Chore', points: 2 }]); }} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} /> Add Chore
          </button>
        </div>
      );
    }

    if (settingsSection === 'bedtime') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Bedtime Tasks</h1>
          
          {/* Countdown Timer Settings */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2 mb-6'}>
            <h2 className={'text-lg font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>⏱️ Timer Mode</h2>
            <label className="flex items-center gap-3 mb-3">
              <input 
                type="checkbox" 
                checked={bedtimeUseCountdown}
                onChange={(e) => setBedtimeUseCountdown(e.target.checked)}
                className="w-5 h-5" 
              />
              <span className={'font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>
                Use countdown timer
              </span>
            </label>
            {bedtimeUseCountdown && (
              <div className="flex items-center gap-3">
                <label className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>Time limit:</label>
                <button
                  onClick={() => setBedtimeCountdownMinutes(Math.max(1, bedtimeCountdownMinutes - 1))}
                  className={(darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600') + ' text-white px-3 py-2 rounded-lg font-bold'}
                >
                  ➖
                </button>
                <span className={'font-bold text-xl min-w-[3rem] text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                  {bedtimeCountdownMinutes}
                </span>
                <button
                  onClick={() => setBedtimeCountdownMinutes(bedtimeCountdownMinutes + 1)}
                  className={(darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600') + ' text-white px-3 py-2 rounded-lg font-bold'}
                >
                  ➕
                </button>
                <span className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>minutes</span>
              </div>
            )}
            <p className={'text-sm mt-3 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>
              {bedtimeUseCountdown 
                ? '⏱️ Countdown: Kids must finish before time runs out or get 0 points!'
                : '⏱️ Stopwatch: Tracks speed, fastest kids earn bonus points'}
            </p>
          </div>
          
          <div className="space-y-2 mb-6">
            {bedtimeTasks.map((task, idx) => (
              <div key={idx} className={'rounded-lg shadow p-3 flex items-center gap-2 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { if (idx > 0) { const n = [...bedtimeTasks]; [n[idx], n[idx - 1]] = [n[idx - 1], n[idx]]; setBedtimeTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronUp size={16} /></button>
                  <button onClick={() => { if (idx < bedtimeTasks.length - 1) { const n = [...bedtimeTasks]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setBedtimeTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronDown size={16} /></button>
                </div>
                <input
                  type="text"
                  defaultValue={task}
                  key={`bedtime-${idx}`}
                  onBlur={(e) => { const n = [...bedtimeTasks]; n[idx] = e.target.value; setBedtimeTasks(n); }}
                  className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')}
                />
                <button onClick={() => setBedtimeTasks(bedtimeTasks.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setBedtimeTasks([...bedtimeTasks, 'New Task'])} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} /> Add Task
          </button>
        </div>
      );
    }

    if (settingsSection === 'rewards') {
      return (
        <div className="p-6 pb-24 pt-12">
          <button onClick={() => setSettingsSection('main')} className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}>← Back</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Manage Rewards</h1>
          <div className="space-y-3 mb-6">
            {rewards.map(reward => (
              <div key={reward.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-lg shadow p-4 border-2'}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className={'text-sm font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Icon:</label>
                    <button
                      onClick={() => {
                        setEditingRewardId(reward.id);
                        setShowEmojiPicker(true);
                      }}
                      className={(darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-100') + ' text-4xl p-2 border-2 rounded-lg'}
                    >
                      {reward.icon}
                    </button>
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-1 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Name:</label>
                    <input 
                      type="text" 
                      defaultValue={reward.name}
                      key={`reward-name-${reward.id}`}
                      onBlur={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, name: e.target.value} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800') + ' w-full p-2 border-2 rounded-lg font-bold'}
                    />
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-1 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Description:</label>
                    <input 
                      type="text" 
                      defaultValue={reward.description}
                      key={`reward-desc-${reward.id}`}
                      onBlur={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, description: e.target.value} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800') + ' w-full p-2 border-2 rounded-lg'}
                    />
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-2 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Point Cost:</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRewards(rewards.map(r => r.id === reward.id ? {...r, cost: Math.max(1, r.cost - 1)} : r))}
                        className={(darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600') + ' text-white px-4 py-2 rounded-lg font-bold'}
                      >
                        ➖
                      </button>
                      <span className={'font-bold text-2xl min-w-[4rem] text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                        {reward.cost}
                      </span>
                      <button
                        onClick={() => setRewards(rewards.map(r => r.id === reward.id ? {...r, cost: r.cost + 1} : r))}
                        className={(darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600') + ' text-white px-4 py-2 rounded-lg font-bold'}
                      >
                        ➕
                      </button>
                      <button
                        onClick={() => setRewards(rewards.map(r => r.id === reward.id ? {...r, cost: r.cost + 5} : r))}
                        className={(darkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700') + ' text-white px-3 py-2 rounded-lg font-semibold text-sm'}
                      >
                        +5
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-300">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={reward.enabled} onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, enabled: e.target.checked} : r))} className="w-5 h-5" />
                      <span className={'text-sm font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Enabled</span>
                    </label>
                    <button onClick={() => setRewards(rewards.filter(r => r.id !== reward.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              const newId = Math.max(...rewards.map(r => r.id), 0) + 1;
              setRewards([...rewards, { id: newId, name: 'New Reward', icon: '🎁', description: 'Describe the reward', cost: 10, enabled: true }]);
            }} 
            className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Plus size={24} /> Add Reward
          </button>
          
          {showEmojiPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={'rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <h2 className={'text-xl font-bold mb-4 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Choose Icon</h2>
                <div className="grid grid-cols-8 gap-2 mb-4">
                  {emojiOptions.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRewards(rewards.map(r => r.id === editingRewardId ? {...r, icon: emoji} : r));
                        setShowEmojiPicker(false);
                        setEditingRewardId(null);
                      }}
                      className={'text-3xl p-2 rounded-lg transition-colors ' + (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowEmojiPicker(false);
                    setEditingRewardId(null);
                  }}
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  }; // End of SettingsPage

  const InstructionsPage = () => {
    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    return (
      <div className="p-6 pb-24 pt-12">
        <button 
          onClick={() => setShowInstructions(false)} 
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}
        >
          ← Back
        </button>
        
        <h1 className={'text-3xl font-bold mb-2 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
          📚 Parent Guide
        </h1>
        <p className={'text-sm mb-6 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>
          Everything you need to know about using the Kids Points Tracker
        </p>

        <div className="space-y-3">
          {/* Overview */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2'}>
            <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
              📱 Overview
            </h2>
            <p className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>
              The Kids Points Tracker helps motivate your children through a fun, gamified points system. Kids earn points by completing morning routines, bedtime routines, and chores, then spend those points on rewards you choose.
            </p>
          </div>

          {/* Main Tabs */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2'}>
            <button 
              onClick={() => toggleSection('tabs')}
              className="w-full flex items-center justify-between"
            >
              <h2 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                🏠 Main Tabs
              </h2>
              <span className="text-2xl">{expandedSections['tabs'] ? '▼' : '▶'}</span>
            </button>
            
            {expandedSections['tabs'] && (
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Kids Dashboard</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Shows each child's current points, badges, and progress toward the next badge.
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Rewards</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Kids can redeem rewards by spending their points.
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Tasks</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Shows Morning Routine, Chores & Homework, and Bedtime Routine activities.
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Parent Dashboard</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Your control center for managing everything!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Routines */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2'}>
            <button 
              onClick={() => toggleSection('routines')}
              className="w-full flex items-center justify-between"
            >
              <h2 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                🌅 Morning & Bedtime Routines
              </h2>
              <span className="text-2xl">{expandedSections['routines'] ? '▼' : '▶'}</span>
            </button>
            
            {expandedSections['routines'] && (
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Stopwatch Mode (Default)</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Tracks how fast each child completes tasks. Fastest child and fastest tasks earn bonus points!
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Countdown Timer Mode</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Set a time limit (e.g., "be ready in 15 minutes"). Kids who finish in time earn points. Those over time get nothing!
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Points Awarded</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    • Fastest overall: +1 bonus point<br/>
                    • Fastest per task: +1 bonus point each<br/>
                    • Countdown mode: Only kids who finish in time get points
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Tips</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    • Use stopwatch mode for casual mornings<br/>
                    • Use countdown timer when you're in a hurry<br/>
                    • Set realistic time limits<br/>
                    • Celebrate improvements!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chores */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2'}>
            <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
              🛏️ Chores & Homework
            </h2>
            <p className={(darkMode ? 'text-gray-300' : 'text-gray-700')}>
              Tap a chore when completed to award points immediately. Points are added instantly!
            </p>
          </div>

          {/* Rewards Tips */}
          <div className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-5 border-2'}>
            <button 
              onClick={() => toggleSection('rewards')}
              className="w-full flex items-center justify-between"
            >
              <h2 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
                🎁 Reward Ideas & Tips
              </h2>
              <span className="text-2xl">{expandedSections['rewards'] ? '▼' : '▶'}</span>
            </button>
            
            {expandedSections['rewards'] && (
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Time-Based</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Screen time (10-15 pts), Video games (15-20 pts), Extra story (8-10 pts)
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Tangible</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Candy (5 pts), Money (10-50 pts), Small toy (20-30 pts)
                  </p>
                </div>
                <div>
                  <h3 className={'font-bold mb-1 ' + (darkMode ? 'text-blue-400' : 'text-blue-600')}>Experience</h3>
                  <p className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                    Pick dinner (15 pts), Choose movie (10 pts), Park visit (20 pts)
                  </p>
                </div>
                <div className={(darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200') + ' p-3 rounded-lg border-2 mt-3'}>
                  <p className={'text-sm font-semibold ' + (darkMode ? 'text-blue-300' : 'text-blue-800')}>
                    💡 Tip: Mix quick wins with big goals to maintain motivation!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pro Tips */}
          <div className={(darkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200') + ' rounded-xl shadow-lg p-5 border-2'}>
            <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
              💡 Pro Tips
            </h2>
            <ul className="space-y-2">
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                ✓ Use countdown timers when you're in a hurry
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                ✓ Let kids help choose rewards they want
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                ✓ Celebrate effort and improvement
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                ✓ Be consistent with routines
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                ✓ Review and adjust point values monthly
              </li>
            </ul>
          </div>

          {/* Quick Start */}
          <div className={(darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200') + ' rounded-xl shadow-lg p-5 border-2'}>
            <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
              🎯 Quick Start Checklist
            </h2>
            <ul className="space-y-2">
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Add your kids with fun avatars
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Customize morning & bedtime tasks
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Create rewards your kids want
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Do a practice run
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Adjust costs based on first week
              </li>
              <li className={(darkMode ? 'text-gray-300' : 'text-gray-700') + ' text-sm'}>
                □ Be consistent for 2+ weeks
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Show instructions if requested
  if (showInstructions) {
    return (
      <div className={'min-h-screen ' + (darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-purple-50')}>
        <InstructionsPage />
      </div>
    );
  }

  // Main app return
  return (
    <div className={'min-h-screen ' + (darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-purple-50')}>
      {currentTab === 'dashboard' && <DashboardPage />}
      {currentTab === 'activities' && !currentActivity && <ActivitiesPage />}
      {currentTab === 'activities' && currentActivity === 'morning' && <MorningRoutinePage />}
      {currentTab === 'activities' && currentActivity === 'chores' && <ChoresPage />}
      {currentTab === 'activities' && currentActivity === 'bedtime' && <BedtimeRoutinePage />}
      {currentTab === 'rewards' && <RewardsPage />}
      {currentTab === 'settings' && <SettingsPage />}
      <TabBar />
    </div>
  );
};

export default KidsPointsApp;