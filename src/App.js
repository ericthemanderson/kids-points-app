import React, { useState, useEffect, useRef } from 'react';
import { Award, Settings, Home, CheckSquare, Plus, Trash2, ChevronUp, ChevronDown, Play, Pause, RotateCcw } from 'lucide-react';

const KidsPointsApp = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentActivity, setCurrentActivity] = useState(null);
  
  const [kids, setKids] = useState([
    { id: 1, name: 'Emma', avatar: '👧', totalPoints: 45, earnedPoints: 120 },
    { id: 2, name: 'Noah', avatar: '👦', totalPoints: 32, earnedPoints: 95 }
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
    { id: 5, name: 'Story Time', icon: '📖', description: 'Extra bedtime story', cost: 8, enabled: true }
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

  const avatarOptions = ['👧', '👦', '👶', '🧒', '👨', '👩', '🧑', '👴', '👵'];

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

    let lastTime = 0;
    for (let i = 0; i < taskIdx; i++) {
      const prevKey = kidId + '-' + i;
      if (morningLapTimes[prevKey]) {
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
  };

  const resetMorningRoutine = () => {
    setMorningActive(false);
    setMorningTime(0);
    setMorningCompleted({});
    setMorningLapTimes({});
    setMorningShowSummary(false);
  };

  const calculateMorningSummary = () => {
    const kidTimes = {};
    const taskWinners = {};

    kids.forEach(kid => {
      let totalTime = 0;
      morningTasks.forEach((task, idx) => {
        const key = kid.id + '-' + idx;
        if (morningLapTimes[key]) {
          totalTime = morningLapTimes[key].absoluteTime;
          if (!taskWinners[idx] || morningLapTimes[key].lapTime < taskWinners[idx].time) {
            taskWinners[idx] = { kidId: kid.id, time: morningLapTimes[key].lapTime };
          }
        }
      });
      kidTimes[kid.id] = totalTime;
    });

    const fastestKid = Object.entries(kidTimes).reduce((min, entry) => {
      const kidId = entry[0];
      const time = entry[1];
      return time < min.time ? { kidId: parseInt(kidId), time } : min;
    }, { kidId: null, time: Infinity });

    return { kidTimes, taskWinners, fastestKid };
  };

  const handleBedtimeTaskClick = (kidId, taskIdx) => {
    const key = kidId + '-' + taskIdx;
    if (bedtimeCompleted[key]) return;

    let lastTime = 0;
    for (let i = 0; i < taskIdx; i++) {
      const prevKey = kidId + '-' + i;
      if (bedtimeLapTimes[prevKey]) {
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
  };

  const resetBedtimeRoutine = () => {
    setBedtimeActive(false);
    setBedtimeTime(0);
    setBedtimeCompleted({});
    setBedtimeLapTimes({});
    setBedtimeShowSummary(false);
  };

  const calculateBedtimeSummary = () => {
    const kidTimes = {};
    const taskWinners = {};

    kids.forEach(kid => {
      let totalTime = 0;
      bedtimeTasks.forEach((task, idx) => {
        const key = kid.id + '-' + idx;
        if (bedtimeLapTimes[key]) {
          totalTime = bedtimeLapTimes[key].absoluteTime;
          if (!taskWinners[idx] || bedtimeLapTimes[key].lapTime < taskWinners[idx].time) {
            taskWinners[idx] = { kidId: kid.id, time: bedtimeLapTimes[key].lapTime };
          }
        }
      });
      kidTimes[kid.id] = totalTime;
    });

    const fastestKid = Object.entries(kidTimes).reduce((min, entry) => {
      const kidId = entry[0];
      const time = entry[1];
      return time < min.time ? { kidId: parseInt(kidId), time } : min;
    }, { kidId: null, time: Infinity });

    return { kidTimes, taskWinners, fastestKid };
  };

  const TabBar = () => (
    <div className={'fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 px-4 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
      <button onClick={() => setCurrentTab('dashboard')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'dashboard' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Home size={24} /><span className="text-xs mt-1">Kids</span>
      </button>
      <button onClick={() => setCurrentTab('activities')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'activities' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <CheckSquare size={24} /><span className="text-xs mt-1">Activities</span>
      </button>
      <button onClick={() => setCurrentTab('rewards')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'rewards' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Award size={24} /><span className="text-xs mt-1">Rewards</span>
      </button>
      <button onClick={() => setCurrentTab('settings')} className={'flex flex-col items-center p-2 rounded-lg ' + (currentTab === 'settings' ? (darkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50') : (darkMode ? 'text-gray-400' : 'text-gray-600'))}>
        <Settings size={24} /><span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  );

  const DashboardPage = () => (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className={'text-3xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Kids Dashboard</h1>
        <button onClick={() => setDarkMode(!darkMode)} className={'p-3 rounded-lg ' + (darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700')}>
          {darkMode ? '☀️' : '🌙'}
        </button>
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
      <div className="p-6 pb-24">
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
        <div className="p-6 pb-24">
          <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Morning Summary 🎉</h1>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Winner</h2>
            {kids.map(kid => kid.id === summary.fastestKid.kidId && (
              <div key={kid.id} className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <div className="text-5xl">{kid.avatar}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{kid.name}</h3>
                  <p className="text-gray-600">Finished in {formatTime(summary.kidTimes[kid.id])}</p>
                  <p className="text-green-600 font-bold">+1 Point! 🏆</p>
                </div>
              </div>
            ))}
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
      <div className="p-6 pb-24">
        <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Morning Routine 🌅</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-blue-600 mb-4">{formatTime(morningTime)}</div>
            <div className="flex gap-2 justify-center">
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
      <div className="p-6 pb-24">
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
        <div className="p-6 pb-24">
          <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Bedtime Summary 🎉</h1>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Winner</h2>
            {kids.map(kid => kid.id === summary.fastestKid.kidId && (
              <div key={kid.id} className="flex items-center gap-4 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <div className="text-5xl">{kid.avatar}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{kid.name}</h3>
                  <p className="text-gray-600">Finished in {formatTime(summary.kidTimes[kid.id])}</p>
                  <p className="text-green-600 font-bold">+1 Point! 🏆</p>
                </div>
              </div>
            ))}
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
      <div className="p-6 pb-24">
        <button onClick={() => setCurrentActivity(null)} className="mb-4 text-blue-600 font-semibold">← Back to Activities</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bedtime Routine 🌙</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-blue-600 mb-4">{formatTime(bedtimeTime)}</div>
            <div className="flex gap-2 justify-center">
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
    <div className="p-6 pb-24">
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
        <div className="p-6 pb-24">
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Settings</h1>
          <div className="space-y-3">
            <button onClick={() => setSettingsSection('kids')} className={'w-full rounded-xl shadow-lg p-5 border-2 hover:shadow-xl transition-shadow text-left ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
              <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>👨‍👩‍👧‍👦 Manage Kids</h3>
              <p className={'text-sm mt-1 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>Add, remove, or edit kids names and avatars</p>
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
        <div className="p-6 pb-24">
          <button onClick={() => setSettingsSection('main')} className="mb-4 text-blue-600 font-semibold">← Back to Settings</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Manage Kids</h1>
          <div className="space-y-4 mb-6">
            {kids.map(kid => (
              <div key={kid.id} className={'rounded-xl shadow-lg p-5 border-2 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100')}>
                <div className="flex items-center gap-3">
                  <select value={kid.avatar} onChange={(e) => setKids(kids.map(k => k.id === kid.id ? {...k, avatar: e.target.value} : k))} className={'text-4xl border-2 rounded-lg p-2 ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-transparent border-gray-200')}>
                    {avatarOptions.map(av => (<option key={av} value={av}>{av}</option>))}
                  </select>
                  <input type="text" value={kid.name} onChange={(e) => setKids(kids.map(k => k.id === kid.id ? {...k, name: e.target.value} : k))} className={'flex-1 text-xl font-bold p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')} />
                  <button onClick={() => setKids(kids.filter(k => k.id !== kid.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={24} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddKid} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} />Add Kid
          </button>
        </div>
      );
    }

    if (settingsSection === 'morning') {
      return (
        <div className="p-6 pb-24">
          <button onClick={() => setSettingsSection('main')} className="mb-4 text-blue-600 font-semibold">← Back to Settings</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Morning Tasks</h1>
          <div className="space-y-2 mb-6">
            {morningTasks.map((task, idx) => (
              <div key={idx} className={'rounded-lg shadow p-3 flex items-center gap-2 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { if (idx > 0) { const n = [...morningTasks]; [n[idx], n[idx - 1]] = [n[idx - 1], n[idx]]; setMorningTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronUp size={16} /></button>
                  <button onClick={() => { if (idx < morningTasks.length - 1) { const n = [...morningTasks]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setMorningTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronDown size={16} /></button>
                </div>
                <input type="text" value={task} onChange={(e) => { const n = [...morningTasks]; n[idx] = e.target.value; setMorningTasks(n); }} className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')} />
                <button onClick={() => setMorningTasks(morningTasks.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setMorningTasks([...morningTasks, 'New Task'])} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} />Add Task
          </button>
        </div>
      );
    }

    if (settingsSection === 'chores') {
      return (
        <div className="p-6 pb-24">
          <button onClick={() => setSettingsSection('main')} className="mb-4 text-blue-600 font-semibold">← Back to Settings</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Chores & Homework</h1>
          <div className="space-y-2 mb-6">
            {chores.map((chore) => (
              <div key={chore.id} className={'rounded-lg shadow p-3 flex items-center gap-2 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <input type="text" value={chore.name} onChange={(e) => setChores(chores.map(c => c.id === chore.id ? {...c, name: e.target.value} : c))} className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')} />
                <select value={chore.points} onChange={(e) => setChores(chores.map(c => c.id === chore.id ? {...c, points: parseInt(e.target.value)} : c))} className={'p-2 border-2 rounded-lg font-bold ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')}>
                  {[1, 2, 3, 4, 5].map(p => (<option key={p} value={p}>{p} pts</option>))}
                </select>
                <button onClick={() => setChores(chores.filter(c => c.id !== chore.id))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => { const newId = Math.max(...chores.map(c => c.id), 0) + 1; setChores([...chores, { id: newId, name: 'New Chore', points: 2 }]); }} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} />Add Chore
          </button>
        </div>
      );
    }

    if (settingsSection === 'bedtime') {
      return (
        <div className="p-6 pb-24">
          <button onClick={() => setSettingsSection('main')} className="mb-4 text-blue-600 font-semibold">← Back to Settings</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Bedtime Tasks</h1>
          <div className="space-y-2 mb-6">
            {bedtimeTasks.map((task, idx) => (
              <div key={idx} className={'rounded-lg shadow p-3 flex items-center gap-2 ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
                <div className="flex flex-col gap-1">
                  <button onClick={() => { if (idx > 0) { const n = [...bedtimeTasks]; [n[idx], n[idx - 1]] = [n[idx - 1], n[idx]]; setBedtimeTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronUp size={16} /></button>
                  <button onClick={() => { if (idx < bedtimeTasks.length - 1) { const n = [...bedtimeTasks]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; setBedtimeTasks(n); }}} className={'p-1 rounded ' + (darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}><ChevronDown size={16} /></button>
                </div>
                <input type="text" value={task} onChange={(e) => { const n = [...bedtimeTasks]; n[idx] = e.target.value; setBedtimeTasks(n); }} className={'flex-1 p-2 border-2 rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'border-gray-200')} />
                <button onClick={() => setBedtimeTasks(bedtimeTasks.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setBedtimeTasks([...bedtimeTasks, 'New Task'])} className="w-full bg-blue-500 text-white rounded-xl p-4 font-bold hover:bg-blue-600 flex items-center justify-center gap-2">
            <Plus size={24} />Add Task
          </button>
        </div>
      );
    }

    if (settingsSection === 'rewards') {
      return (
        <div className="p-6 pb-24">
          <button onClick={() => setSettingsSection('main')} className="mb-4 text-blue-600 font-semibold">← Back to Settings</button>
          <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Manage Rewards</h1>
          <div className="space-y-3 mb-6">
            {rewards.map(reward => (
              <div key={reward.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-lg shadow p-4 border-2'}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className={'text-sm font-semibold ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Icon:</label>
                    <select 
                      value={reward.icon} 
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, icon: e.target.value} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200') + ' text-3xl p-2 border-2 rounded-lg'}
                    >
                      {emojiOptions.map(emoji => (<option key={emoji} value={emoji}>{emoji}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-1 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Name:</label>
                    <input 
                      type="text" 
                      value={reward.name} 
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, name: e.target.value} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800') + ' w-full p-2 border-2 rounded-lg font-bold'}
                    />
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-1 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Description:</label>
                    <input 
                      type="text" 
                      value={reward.description} 
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, description: e.target.value} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800') + ' w-full p-2 border-2 rounded-lg'}
                    />
                  </div>
                  <div>
                    <label className={'text-sm font-semibold block mb-1 ' + (darkMode ? 'text-gray-300' : 'text-gray-700')}>Point Cost:</label>
                    <input 
                      type="number" 
                      value={reward.cost} 
                      onChange={(e) => setRewards(rewards.map(r => r.id === reward.id ? {...r, cost: parseInt(e.target.value) || 0} : r))} 
                      className={(darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-800') + ' w-full p-2 border-2 rounded-lg font-bold'}
                    />
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
            <Plus size={24} />Add Reward
          </button>
        </div>
      );
    }
  };

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