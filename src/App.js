import React, { useState, useEffect, useRef } from 'react';
import { Award, Settings, Home, CheckSquare, Plus, Trash2, ChevronUp, ChevronDown, Play, Pause, RotateCcw } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';

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
    <div className={'fixed bottom-0 left-0 right-0 border-t flex justify-around py-2 px-4 ' + (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')} style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
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

  const RewardsPage = () => {
    const handleRewardClick = (reward) => {
      if (!reward.enabled) return;
      setSelectedReward(reward);
      setShowRewardModal(true);
    };

    const handleKidSelect = (kid) => {
      setSelectedKidForReward(kid);
      setShowConfirmModal(true);
    };

    const confirmReward = () => {
      if (selectedKidForReward && selectedReward) {
        const kid = selectedKidForReward;
        if (kid.totalPoints >= selectedReward.cost) {
          setKids(kids.map(k => 
            k.id === kid.id 
              ? {...k, totalPoints: k.totalPoints - selectedReward.cost}
              : k
          ));
        }
      }
      setShowRewardModal(false);
      setShowConfirmModal(false);
      setSelectedReward(null);
      setSelectedKidForReward(null);
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
    
    return (
      <div className="p-6 pb-24">
        <h1 className={'text-3xl font-bold mb-4 ' + textClass}>Rewards</h1>
        <p className={'text-gray-600 mb-6 ' + (darkMode ? 'text-gray-400' : '')}>Spend your points on fun rewards!</p>
        
        <div className="grid grid-cols-2 gap-4">
          {rewards.filter(r => r.enabled).map(reward => (
            <button
              key={reward.id}
              onClick={() => handleRewardClick(reward)}
              className={'rounded-xl shadow-lg p-6 border-2 transition-shadow hover:shadow-xl ' + bgClass}
            >
              <div className="text-5xl mb-3">{reward.icon}</div>
              <h3 className={'font-bold mb-2 ' + textClass}>{reward.name}</h3>
              <p className={'text-xs mb-3 ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{reward.description}</p>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold inline-block">
                {reward.cost}points
              </div>
            </button>
          ))}
        </div>

        {showRewardModal && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={'rounded-xl shadow-2xl p-6 max-w-md w-full ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{selectedReward.icon}</div>
                <h2 className={'text-2xl font-bold mb-2 ' + textClass}>{selectedReward.name}</h2>
                <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' mb-4'}>{selectedReward.description}</p>
                <p className={'text-lg font-bold ' + textClass}>Cost: {selectedReward.cost} points</p>
              </div>
              
              <div className="mb-4">
                <p className={'font-semibold mb-3 ' + textClass}>Who wants this reward?</p>
                <div className="space-y-2">
                  {kids.map(kid => (
                    <button
                      key={kid.id}
                      onClick={() => handleKidSelect(kid)}
                      disabled={kid.totalPoints < selectedReward.cost}
                      className={'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ' + 
                        (kid.totalPoints >= selectedReward.cost 
                          ? 'border-green-500 hover:bg-green-50' 
                          : 'border-gray-300 opacity-50 cursor-not-allowed')}
                    >
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{kid.avatar}</span>
                        <span className={'font-semibold ' + textClass}>{kid.name}</span>
                      </div>
                      <span className={'font-bold ' + (kid.totalPoints >= selectedReward.cost ? 'text-green-600' : 'text-red-600')}>
                        {kid.totalPoints} pts
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowRewardModal(false);
                  setSelectedReward(null);
                }}
                className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showConfirmModal && selectedKidForReward && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={'rounded-xl shadow-2xl p-6 max-w-md w-full ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h2 className={'text-2xl font-bold mb-4 text-center ' + textClass}>Confirm Reward</h2>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{selectedKidForReward.avatar}</div>
                <p className={textClass}>
                  Give <strong>{selectedKidForReward.name}</strong> the reward:
                </p>
                <p className={'text-xl font-bold my-3 ' + textClass}>{selectedReward.name}</p>
                <p className={(darkMode ? 'text-gray-400' : 'text-gray-600')}>
                  This will cost {selectedReward.cost} points.
                </p>
                <p className={(darkMode ? 'text-gray-400' : 'text-gray-600')}>
                  New balance: {selectedKidForReward.totalPoints - selectedReward.cost} points
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedKidForReward(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReward}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsPage = () => {
    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';
    
    if (settingsSection === 'kids') {
      return <ManageKidsPage />;
    }
    if (settingsSection === 'morning') {
      return <ManageMorningTasksPage />;
    }
    if (settingsSection === 'chores') {
      return <ManageChoresPage />;
    }
    if (settingsSection === 'bedtime') {
      return <ManageBedtimeTasksPage />;
    }
    if (settingsSection === 'rewards') {
      return <ManageRewardsPage />;
    }

    return (
      <div className="p-6 pb-24">
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Settings</h1>
        <div className="space-y-4">
          <button 
            onClick={() => setSettingsSection('kids')}
            className={'w-full rounded-xl shadow-lg p-6 border-2 text-left hover:shadow-xl transition-shadow ' + bgClass}
          >
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-3">👥</span>
              <h2 className={'text-xl font-bold ' + textClass}>Manage Kids</h2>
            </div>
            <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-sm'}>Add, remove, or edit kids names and avatars</p>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setSettingsSection('morning')}
              className={'rounded-xl shadow-lg p-6 border-2 text-left hover:shadow-xl transition-shadow ' + bgClass}
            >
              <div className="text-4xl mb-2">🌅</div>
              <h2 className={'text-lg font-bold mb-1 ' + textClass}>Morning Tasks</h2>
              <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-xs'}>Edit morning routine tasks</p>
            </button>

            <button 
              onClick={() => setSettingsSection('chores')}
              className={'rounded-xl shadow-lg p-6 border-2 text-left hover:shadow-xl transition-shadow ' + bgClass}
            >
              <div className="text-4xl mb-2">🛏️</div>
              <h2 className={'text-lg font-bold mb-1 ' + textClass}>Chores & Homework</h2>
              <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-xs'}>Edit chores and point values</p>
            </button>

            <button 
              onClick={() => setSettingsSection('bedtime')}
              className={'rounded-xl shadow-lg p-6 border-2 text-left hover:shadow-xl transition-shadow ' + bgClass}
            >
              <div className="text-4xl mb-2">🌙</div>
              <h2 className={'text-lg font-bold mb-1 ' + textClass}>Bedtime Tasks</h2>
              <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-xs'}>Edit bedtime routine tasks</p>
            </button>

            <button 
              onClick={() => setSettingsSection('rewards')}
              className={'rounded-xl shadow-lg p-6 border-2 text-left hover:shadow-xl transition-shadow ' + bgClass}
            >
              <div className="text-4xl mb-2">🏅</div>
              <h2 className={'text-lg font-bold mb-1 ' + textClass}>Rewards</h2>
              <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-xs'}>Enable/disable and edit rewards</p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ManageKidsPage = () => {
    const [editingKid, setEditingKid] = useState(null);
    const [newKidName, setNewKidName] = useState('');
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('👧');

    const addKid = () => {
      if (newKidName.trim()) {
        const newKid = {
          id: Date.now(),
          name: newKidName.trim(),
          avatar: selectedAvatar,
          totalPoints: 0,
          earnedPoints: 0
        };
        setKids([...kids, newKid]);
        setNewKidName('');
        setSelectedAvatar('👧');
      }
    };

    const deleteKid = (kidId) => {
      setKids(kids.filter(k => k.id !== kidId));
    };

    const updateKidName = (kidId, newName) => {
      setKids(kids.map(k => k.id === kidId ? {...k, name: newName} : k));
    };

    const updateKidAvatar = (kidId, newAvatar) => {
      setKids(kids.map(k => k.id === kidId ? {...k, avatar: newAvatar} : k));
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setSettingsSection('main')}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-4 font-semibold'}
        >
          ← Back to Settings
        </button>
        
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Manage Kids</h1>
        
        <div className="space-y-4 mb-6">
          {kids.map(kid => (
            <div key={kid.id} className={'flex items-center gap-3 p-4 rounded-xl border-2 ' + bgClass}>
              <button
                onClick={() => {
                  setEditingKid(kid.id);
                  setShowAvatarPicker(true);
                }}
                className="text-5xl"
              >
                {kid.avatar}
              </button>
              <input
                type="text"
                defaultValue={kid.name}
                onBlur={(e) => updateKidName(kid.id, e.target.value)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
              />
              <button
                onClick={() => deleteKid(kid.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className={'p-4 rounded-xl border-2 ' + bgClass}>
          <h2 className={'font-bold mb-3 ' + textClass}>Add New Kid</h2>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="text-5xl"
            >
              {selectedAvatar}
            </button>
            <input
              type="text"
              value={newKidName}
              onChange={(e) => setNewKidName(e.target.value)}
              placeholder="Kid's name"
              className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
            />
          </div>
          <button
            onClick={addKid}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Kid
          </button>
        </div>

        {showAvatarPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={'rounded-xl shadow-2xl p-6 max-w-md w-full ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h2 className={'text-xl font-bold mb-4 ' + textClass}>Choose Avatar</h2>
              <div className="grid grid-cols-5 gap-3 mb-4">
                {avatarOptions.map((avatar, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (editingKid) {
                        updateKidAvatar(editingKid, avatar);
                      } else {
                        setSelectedAvatar(avatar);
                      }
                      setShowAvatarPicker(false);
                      setEditingKid(null);
                    }}
                    className="text-5xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowAvatarPicker(false);
                  setEditingKid(null);
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
  };

  const ManageMorningTasksPage = () => {
    const [newTask, setNewTask] = useState('');

    const addTask = () => {
      if (newTask.trim()) {
        setMorningTasks([...morningTasks, newTask.trim()]);
        setNewTask('');
      }
    };

    const deleteTask = (index) => {
      setMorningTasks(morningTasks.filter((_, i) => i !== index));
    };

    const moveTaskUp = (index) => {
      if (index > 0) {
        const newTasks = [...morningTasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        setMorningTasks(newTasks);
      }
    };

    const moveTaskDown = (index) => {
      if (index < morningTasks.length - 1) {
        const newTasks = [...morningTasks];
        [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
        setMorningTasks(newTasks);
      }
    };

    const updateTask = (index, newValue) => {
      const newTasks = [...morningTasks];
      newTasks[index] = newValue;
      setMorningTasks(newTasks);
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setSettingsSection('main')}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-4 font-semibold'}
        >
          ← Back to Settings
        </button>
        
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Morning Tasks</h1>
        
        <div className="space-y-3 mb-6">
          {morningTasks.map((task, index) => (
            <div key={index} className={'flex items-center gap-2 p-3 rounded-xl border-2 ' + bgClass}>
              <span className={'font-semibold w-8 ' + textClass}>{index + 1}.</span>
              <input
                type="text"
                defaultValue={task}
                onBlur={(e) => updateTask(index, e.target.value)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
              />
              <div className="flex gap-1">
                <button
                  onClick={() => moveTaskUp(index)}
                  disabled={index === 0}
                  className={'p-2 rounded-lg ' + (index === 0 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600')}
                >
                  <ChevronUp size={20} />
                </button>
                <button
                  onClick={() => moveTaskDown(index)}
                  disabled={index === morningTasks.length - 1}
                  className={'p-2 rounded-lg ' + (index === morningTasks.length - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600')}
                >
                  <ChevronDown size={20} />
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={'p-4 rounded-xl border-2 ' + bgClass}>
          <h2 className={'font-bold mb-3 ' + textClass}>Add New Task</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task name"
              className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ManageChoresPage = () => {
    const [newChoreName, setNewChoreName] = useState('');
    const [newChorePoints, setNewChorePoints] = useState(2);

    const addChore = () => {
      if (newChoreName.trim()) {
        const newChore = {
          id: Date.now(),
          name: newChoreName.trim(),
          points: newChorePoints
        };
        setChores([...chores, newChore]);
        setNewChoreName('');
        setNewChorePoints(2);
      }
    };

    const deleteChore = (choreId) => {
      setChores(chores.filter(c => c.id !== choreId));
    };

    const updateChore = (choreId, field, value) => {
      setChores(chores.map(c => 
        c.id === choreId ? {...c, [field]: value} : c
      ));
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setSettingsSection('main')}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-4 font-semibold'}
        >
          ← Back to Settings
        </button>
        
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Chores & Homework</h1>
        
        <div className="space-y-3 mb-6">
          {chores.map(chore => (
            <div key={chore.id} className={'flex items-center gap-3 p-3 rounded-xl border-2 ' + bgClass}>
              <input
                type="text"
                defaultValue={chore.name}
                onBlur={(e) => updateChore(chore.id, 'name', e.target.value)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
              />
              <input
                type="number"
                defaultValue={chore.points}
                onBlur={(e) => updateChore(chore.id, 'points', parseInt(e.target.value) || 1)}
                className={'w-20 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                min="1"
              />
              <span className={textClass}>pts</span>
              <button
                onClick={() => deleteChore(chore.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className={'p-4 rounded-xl border-2 ' + bgClass}>
          <h2 className={'font-bold mb-3 ' + textClass}>Add New Chore</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newChoreName}
              onChange={(e) => setNewChoreName(e.target.value)}
              placeholder="Chore name"
              className={'px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={newChorePoints}
                onChange={(e) => setNewChorePoints(parseInt(e.target.value) || 1)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                min="1"
              />
              <span className={'flex items-center ' + textClass}>points</span>
            </div>
            <button
              onClick={addChore}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Chore
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ManageBedtimeTasksPage = () => {
    const [newTask, setNewTask] = useState('');

    const addTask = () => {
      if (newTask.trim()) {
        setBedtimeTasks([...bedtimeTasks, newTask.trim()]);
        setNewTask('');
      }
    };

    const deleteTask = (index) => {
      setBedtimeTasks(bedtimeTasks.filter((_, i) => i !== index));
    };

    const moveTaskUp = (index) => {
      if (index > 0) {
        const newTasks = [...bedtimeTasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        setBedtimeTasks(newTasks);
      }
    };

    const moveTaskDown = (index) => {
      if (index < bedtimeTasks.length - 1) {
        const newTasks = [...bedtimeTasks];
        [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
        setBedtimeTasks(newTasks);
      }
    };

    const updateTask = (index, newValue) => {
      const newTasks = [...bedtimeTasks];
      newTasks[index] = newValue;
      setBedtimeTasks(newTasks);
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setSettingsSection('main')}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-4 font-semibold'}
        >
          ← Back to Settings
        </button>
        
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Bedtime Tasks</h1>
        
        <div className="space-y-3 mb-6">
          {bedtimeTasks.map((task, index) => (
            <div key={index} className={'flex items-center gap-2 p-3 rounded-xl border-2 ' + bgClass}>
              <span className={'font-semibold w-8 ' + textClass}>{index + 1}.</span>
              <input
                type="text"
                defaultValue={task}
                onBlur={(e) => updateTask(index, e.target.value)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
              />
              <div className="flex gap-1">
                <button
                  onClick={() => moveTaskUp(index)}
                  disabled={index === 0}
                  className={'p-2 rounded-lg ' + (index === 0 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600')}
                >
                  <ChevronUp size={20} />
                </button>
                <button
                  onClick={() => moveTaskDown(index)}
                  disabled={index === bedtimeTasks.length - 1}
                  className={'p-2 rounded-lg ' + (index === bedtimeTasks.length - 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600')}
                >
                  <ChevronDown size={20} />
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={'p-4 rounded-xl border-2 ' + bgClass}>
          <h2 className={'font-bold mb-3 ' + textClass}>Add New Task</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task name"
              className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
            />
            <button
              onClick={addTask}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ManageRewardsPage = () => {
    const [newRewardName, setNewRewardName] = useState('');
    const [newRewardDescription, setNewRewardDescription] = useState('');
    const [newRewardCost, setNewRewardCost] = useState(10);
    const [newRewardIcon, setNewRewardIcon] = useState('🎁');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [editingReward, setEditingReward] = useState(null);

    const addReward = () => {
      if (newRewardName.trim() && newRewardDescription.trim()) {
        const newReward = {
          id: Date.now(),
          name: newRewardName.trim(),
          description: newRewardDescription.trim(),
          cost: newRewardCost,
          icon: newRewardIcon,
          enabled: true
        };
        setRewards([...rewards, newReward]);
        setNewRewardName('');
        setNewRewardDescription('');
        setNewRewardCost(10);
        setNewRewardIcon('🎁');
      }
    };

    const deleteReward = (rewardId) => {
      setRewards(rewards.filter(r => r.id !== rewardId));
    };

    const toggleReward = (rewardId) => {
      setRewards(rewards.map(r => 
        r.id === rewardId ? {...r, enabled: !r.enabled} : r
      ));
    };

    const updateReward = (rewardId, field, value) => {
      setRewards(rewards.map(r => 
        r.id === rewardId ? {...r, [field]: value} : r
      ));
    };

    const bgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
    const textClass = darkMode ? 'text-gray-100' : 'text-gray-800';

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setSettingsSection('main')}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-4 font-semibold'}
        >
          ← Back to Settings
        </button>
        
        <h1 className={'text-3xl font-bold mb-6 ' + textClass}>Manage Rewards</h1>
        
        <div className="space-y-3 mb-6">
          {rewards.map(reward => (
            <div key={reward.id} className={'p-4 rounded-xl border-2 ' + bgClass + ' ' + (reward.enabled ? '' : 'opacity-50')}>
              <div className="flex items-start gap-3 mb-3">
                <button
                  onClick={() => {
                    setEditingReward(reward.id);
                    setShowIconPicker(true);
                  }}
                  className="text-4xl"
                >
                  {reward.icon}
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    defaultValue={reward.name}
                    onBlur={(e) => updateReward(reward.id, 'name', e.target.value)}
                    className={'w-full px-3 py-2 border rounded-lg mb-2 ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                  />
                  <input
                    type="text"
                    defaultValue={reward.description}
                    onBlur={(e) => updateReward(reward.id, 'description', e.target.value)}
                    className={'w-full px-3 py-2 border rounded-lg text-sm ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={reward.cost}
                  onBlur={(e) => updateReward(reward.id, 'cost', parseInt(e.target.value) || 1)}
                  className={'w-20 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                  min="1"
                />
                <span className={textClass}>points</span>
                <button
                  onClick={() => toggleReward(reward.id)}
                  className={'px-4 py-2 rounded-lg font-semibold ' + (reward.enabled ? 'bg-green-500 text-white' : 'bg-gray-400 text-white')}
                >
                  {reward.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-auto"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={'p-4 rounded-xl border-2 ' + bgClass}>
          <h2 className={'font-bold mb-3 ' + textClass}>Add New Reward</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowIconPicker(true)}
                className="text-4xl"
              >
                {newRewardIcon}
              </button>
              <input
                type="text"
                value={newRewardName}
                onChange={(e) => setNewRewardName(e.target.value)}
                placeholder="Reward name"
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
              />
            </div>
            <input
              type="text"
              value={newRewardDescription}
              onChange={(e) => setNewRewardDescription(e.target.value)}
              placeholder="Description"
              className={'px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={newRewardCost}
                onChange={(e) => setNewRewardCost(parseInt(e.target.value) || 1)}
                className={'flex-1 px-3 py-2 border rounded-lg ' + (darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                min="1"
              />
              <span className={'flex items-center ' + textClass}>points</span>
            </div>
            <button
              onClick={addReward}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Reward
            </button>
          </div>
        </div>

        {showIconPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={'rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto ' + (darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h2 className={'text-xl font-bold mb-4 ' + textClass}>Choose Icon</h2>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {emojiOptions.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (editingReward) {
                        updateReward(editingReward, 'icon', emoji);
                      } else {
                        setNewRewardIcon(emoji);
                      }
                      setShowIconPicker(false);
                      setEditingReward(null);
                    }}
                    className="text-3xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowIconPicker(false);
                  setEditingReward(null);
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
  };

  const MorningRoutinePage = () => {
    if (morningShowSummary) {
      const summary = calculateMorningSummary();
      const winner = kids.find(k => k.id === summary.fastestKid.kidId);
      
      return (
        <div className="p-6 pb-24">
          <div className={(darkMode ? 'bg-gray-800' : 'bg-white') + ' rounded-xl shadow-lg p-6'}>
            <h1 className={'text-3xl font-bold mb-6 text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Morning Complete! 🎉</h1>
            
            <div className="mb-6 text-center">
              <p className={'text-xl font-bold mb-2 ' + (darkMode ? 'text-gray-200' : 'text-gray-800')}>Fastest Overall:</p>
              <div className="text-6xl mb-2">{winner?.avatar}</div>
              <p className={'text-2xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{winner?.name}</p>
              <p className={'text-lg ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{formatTime(summary.fastestKid.time)}</p>
              <p className="text-green-600 font-bold text-lg">+1 point!</p>
            </div>

            <div className="mb-6">
              <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-200' : 'text-gray-800')}>Task Winners:</h2>
              <div className="space-y-2">
                {morningTasks.map((task, idx) => {
                  const taskWinner = summary.taskWinners[idx];
                  if (!taskWinner) return null;
                  const winnerKid = kids.find(k => k.id === taskWinner.kidId);
                  return (
                    <div key={idx} className={(darkMode ? 'bg-gray-700' : 'bg-gray-50') + ' p-3 rounded-lg flex justify-between items-center'}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{winnerKid?.avatar}</span>
                        <span className={(darkMode ? 'text-gray-200' : 'text-gray-800')}>{task}</span>
                      </div>
                      <div className="text-right">
                        <p className={'font-semibold ' + (darkMode ? 'text-gray-100' : 'text-gray-900')}>{winnerKid?.name}</p>
                        <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-sm'}>{formatTime(taskWinner.time)}</p>
                        <p className="text-green-600 text-sm font-bold">+1 pt</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentActivity(null)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Done
              </button>
              <button
                onClick={resetMorningRoutine}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentActivity(null)}
            className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg font-semibold'}
          >
            ← Back
          </button>
          <div className={'text-4xl font-bold font-mono ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
            {formatTime(morningTime)}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={morningActive ? () => setMorningActive(false) : startMorningRoutine}
            className={'flex-1 py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ' + (morningActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700')}
          >
            {morningActive ? <><Pause size={24} /> Pause</> : <><Play size={24} /> Start</>}
          </button>
          <button
            onClick={resetMorningRoutine}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kids.map(kid => (
            <div key={kid.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-4 border-2'}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{kid.avatar}</span>
                <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</h3>
              </div>
              <div className="space-y-2">
                {morningTasks.map((task, idx) => {
                  const key = kid.id + '-' + idx;
                  const isCompleted = morningCompleted[key];
                  const lapTime = morningLapTimes[key];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMorningTaskClick(kid.id, idx)}
                      disabled={!morningActive || isCompleted}
                      className={'w-full p-3 rounded-lg text-left transition-all ' + 
                        (isCompleted 
                          ? 'bg-green-100 border-2 border-green-500' 
                          : morningActive 
                            ? 'bg-blue-50 border-2 border-blue-300 hover:bg-blue-100' 
                            : 'bg-gray-100 border-2 border-gray-300')}
                    >
                      <div className="flex justify-between items-center">
                        <span className={'font-semibold ' + (isCompleted ? 'line-through text-gray-600' : 'text-gray-800')}>
                          {idx + 1}. {task}
                        </span>
                        {isCompleted && lapTime && (
                          <span className="text-sm text-green-700 font-mono">{formatTime(lapTime.lapTime)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ChoresPage = () => {
    const handleChoreComplete = (kidId, choreId, points) => {
      const key = kidId + '-' + choreId;
      if (!choresCompleted[key]) {
        const newCompleted = {...choresCompleted};
        newCompleted[key] = true;
        setChoresCompleted(newCompleted);
        
        setKids(kids.map(k => 
          k.id === kidId 
            ? {...k, totalPoints: k.totalPoints + points, earnedPoints: k.earnedPoints + points}
            : k
        ));
      }
    };

    return (
      <div className="p-6 pb-24">
        <button 
          onClick={() => setCurrentActivity(null)}
          className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg mb-6 font-semibold'}
        >
          ← Back
        </button>

        <h1 className={'text-3xl font-bold mb-6 ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Chores & Homework</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kids.map(kid => (
            <div key={kid.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-4 border-2'}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{kid.avatar}</span>
                <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</h3>
              </div>
              <div className="space-y-2">
                {chores.map(chore => {
                  const key = kid.id + '-' + chore.id;
                  const isCompleted = choresCompleted[key];
                  return (
                    <button
                      key={chore.id}
                      onClick={() => handleChoreComplete(kid.id, chore.id, chore.points)}
                      disabled={isCompleted}
                      className={'w-full p-3 rounded-lg text-left transition-all ' + 
                        (isCompleted 
                          ? 'bg-green-100 border-2 border-green-500' 
                          : 'bg-blue-50 border-2 border-blue-300 hover:bg-blue-100')}
                    >
                      <div className="flex justify-between items-center">
                        <span className={'font-semibold ' + (isCompleted ? 'line-through text-gray-600' : 'text-gray-800')}>
                          {chore.name}
                        </span>
                        <span className={'font-bold ' + (isCompleted ? 'text-green-600' : 'text-blue-600')}>
                          {isCompleted ? '✓ ' : ''}{chore.points} pts
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BedtimeRoutinePage = () => {
    if (bedtimeShowSummary) {
      const summary = calculateBedtimeSummary();
      const winner = kids.find(k => k.id === summary.fastestKid.kidId);
      
      return (
        <div className="p-6 pb-24">
          <div className={(darkMode ? 'bg-gray-800' : 'bg-white') + ' rounded-xl shadow-lg p-6'}>
            <h1 className={'text-3xl font-bold mb-6 text-center ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>Bedtime Complete! 🎉</h1>
            
            <div className="mb-6 text-center">
              <p className={'text-xl font-bold mb-2 ' + (darkMode ? 'text-gray-200' : 'text-gray-800')}>Fastest Overall:</p>
              <div className="text-6xl mb-2">{winner?.avatar}</div>
              <p className={'text-2xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{winner?.name}</p>
              <p className={'text-lg ' + (darkMode ? 'text-gray-400' : 'text-gray-600')}>{formatTime(summary.fastestKid.time)}</p>
              <p className="text-green-600 font-bold text-lg">+1 point!</p>
            </div>

            <div className="mb-6">
              <h2 className={'text-xl font-bold mb-3 ' + (darkMode ? 'text-gray-200' : 'text-gray-800')}>Task Winners:</h2>
              <div className="space-y-2">
                {bedtimeTasks.map((task, idx) => {
                  const taskWinner = summary.taskWinners[idx];
                  if (!taskWinner) return null;
                  const winnerKid = kids.find(k => k.id === taskWinner.kidId);
                  return (
                    <div key={idx} className={(darkMode ? 'bg-gray-700' : 'bg-gray-50') + ' p-3 rounded-lg flex justify-between items-center'}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{winnerKid?.avatar}</span>
                        <span className={(darkMode ? 'text-gray-200' : 'text-gray-800')}>{task}</span>
                      </div>
                      <div className="text-right">
                        <p className={'font-semibold ' + (darkMode ? 'text-gray-100' : 'text-gray-900')}>{winnerKid?.name}</p>
                        <p className={(darkMode ? 'text-gray-400' : 'text-gray-600') + ' text-sm'}>{formatTime(taskWinner.time)}</p>
                        <p className="text-green-600 text-sm font-bold">+1 pt</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentActivity(null)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Done
              </button>
              <button
                onClick={resetBedtimeRoutine}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentActivity(null)}
            className={(darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800') + ' px-4 py-2 rounded-lg font-semibold'}
          >
            ← Back
          </button>
          <div className={'text-4xl font-bold font-mono ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>
            {formatTime(bedtimeTime)}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={bedtimeActive ? () => setBedtimeActive(false) : startBedtimeRoutine}
            className={'flex-1 py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ' + (bedtimeActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700')}
          >
            {bedtimeActive ? <><Pause size={24} /> Pause</> : <><Play size={24} /> Start</>}
          </button>
          <button
            onClick={resetBedtimeRoutine}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold flex items-center gap-2"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kids.map(kid => (
            <div key={kid.id} className={(darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100') + ' rounded-xl shadow-lg p-4 border-2'}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{kid.avatar}</span>
                <h3 className={'text-xl font-bold ' + (darkMode ? 'text-gray-100' : 'text-gray-800')}>{kid.name}</h3>
              </div>
              <div className="space-y-2">
                {bedtimeTasks.map((task, idx) => {
                  const key = kid.id + '-' + idx;
                  const isCompleted = bedtimeCompleted[key];
                  const lapTime = bedtimeLapTimes[key];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleBedtimeTaskClick(kid.id, idx)}
                      disabled={!bedtimeActive || isCompleted}
                      className={'w-full p-3 rounded-lg text-left transition-all ' + 
                        (isCompleted 
                          ? 'bg-green-100 border-2 border-green-500' 
                          : bedtimeActive 
                            ? 'bg-blue-50 border-2 border-blue-300 hover:bg-blue-100' 
                            : 'bg-gray-100 border-2 border-gray-300')}
                    >
                      <div className="flex justify-between items-center">
                        <span className={'font-semibold ' + (isCompleted ? 'line-through text-gray-600' : 'text-gray-800')}>
                          {idx + 1}. {task}
                        </span>
                        {isCompleted && lapTime && (
                          <span className="text-sm text-green-700 font-mono">{formatTime(lapTime.lapTime)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={(darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50') + ' min-h-screen'}>
      {currentActivity === 'morning' && <MorningRoutinePage />}
      {currentActivity === 'chores' && <ChoresPage />}
      {currentActivity === 'bedtime' && <BedtimeRoutinePage />}
      {!currentActivity && (
        <>
          {currentTab === 'dashboard' && <DashboardPage />}
          {currentTab === 'activities' && <ActivitiesPage />}
          {currentTab === 'rewards' && <RewardsPage />}
          {currentTab === 'settings' && <SettingsPage />}
          <TabBar />
        </>
      )}
    </div>
  );
};

export default KidsPointsApp;