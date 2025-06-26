"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Play, Pause } from 'lucide-react';

// Data class equivalent
class Data {
  constructor(dimension, isUp, isMuted, frequency) {
    this.dimension = dimension;
    this.isUp = isUp;
    this.isMuted = isMuted;
    this.frequency = frequency;
  }

  setMuted(muted) {
    this.isMuted = muted;
  }
}

// TreeNode class equivalent
class TreeNode {
  static nextID = 0;

  constructor(data) {
    this.data = data;
    this.children = [];
    this.parent = null;
    this.coordinate = [0, 0];
    this.id = TreeNode.nextID++;
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  setCoordinateX(x) {
    this.coordinate[0] = x;
  }

  setCoordinateY(y) {
    this.coordinate[1] = y;
  }

  getCoordinateX() {
    return this.coordinate[0];
  }

  getCoordinateY() {
    return this.coordinate[1];
  }

  getIDPath() {
    const path = [];
    let current = this;
    while (current !== null) {
      path.unshift(current.id);
      current = current.parent;
    }
    return path;
  }

  getRoot() {
    let current = this;
    while (current.parent !== null) {
      current = current.parent;
    }
    return current;
  }

  removeNode(nodeToRemove) {
    if (nodeToRemove === this) {
      return false; // Can't remove root
    }
    return this.removeNodeRecursive(this, nodeToRemove);
  }

  removeNodeRecursive(parent, nodeToRemove) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (child === nodeToRemove) {
        parent.children.splice(i, 1);
        return true;
      }
      if (this.removeNodeRecursive(child, nodeToRemove)) {
        return true;
      }
    }
    return false;
  }

  getNodeByPath(path) {
    if (!path || path.length === 0) return null;
    if (path.length === 1) return this;

    const remainingPath = path.slice(1);
    let currentNode = this;

    for (const id of remainingPath) {
      let nextNode = null;
      for (const child of currentNode.children) {
        if (child.id === id) {
          nextNode = child;
          break;
        }
      }
      if (!nextNode) return null;
      currentNode = nextNode;
    }
    return currentNode;
  }

  searchCoordinate(x, y) {
    if (x < this.coordinate[0] + 160 && x > this.coordinate[0] - 15 &&
        Math.abs(this.coordinate[1] - y) < 6) {
      return this;
    }

    for (const child of this.children) {
      const result = child.searchCoordinate(x, y);
      if (result) return result;
    }
    return null;
  }

  returnFrequencies() {
    const frequencies = [];
    if (!this.data.isMuted) {
      frequencies.push(this.data.frequency);
    }
    for (const child of this.children) {
      frequencies.push(...child.returnFrequencies());
    }
    return frequencies;
  }

  rootCoordinate(howUp) {
    this.setCoordinateY(this.getCoordinateY() + howUp);
    for (const child of this.children) {
      child.rootCoordinate(howUp);
    }
  }
}

// Audio synthesis functions
const generateSineValue = (frequency, time) => Math.sin(2 * Math.PI * frequency * time);
const generateSawtoothValue = (frequency, time) => {
  const period = 1.0 / frequency;
  const timeInPeriod = time % period;
  return 2.0 * (timeInPeriod / period) - 1.0;
};
const generateSquareValue = (frequency, time) => {
  const period = 1.0 / frequency;
  const halfPeriod = period / 2.0;
  const timeInPeriod = time % period;
  return (timeInPeriod < halfPeriod) ? 1.0 : -1.0;
};
const generateTriangleValue = (frequency, time) => {
  const period = 1.0 / frequency;
  const quarterPeriod = period / 4.0;
  const timeInPeriod = time % period;

  if (timeInPeriod < quarterPeriod) {
    return 4.0 * timeInPeriod / period;
  } else if (timeInPeriod < 3 * quarterPeriod) {
    return 1.0 - 4.0 * (timeInPeriod - quarterPeriod) / period;
  } else {
    return -1.0 + 4.0 * (timeInPeriod - 3 * quarterPeriod) / period;
  }
};

const ValinomCluinataEditor = () => {
  const canvasRef = useRef(null);
  const [isPitch, setIsPitch] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [synType, setSynType] = useState(0);
  const [timeField, setTimeField] = useState('3');
  const [selectedPitchline, setSelectedPitchline] = useState([]);
  const [sideIndex, setSideIndex] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [currentGainNode, setCurrentGainNode] = useState(null);

  // Initialize data
  const rootFrequency = Math.pow(2, 0.25) * 220;
  const [pitchData, setPitchData] = useState([]);
  const [rootX, setRootX] = useState([]);
  const [rootY, setRootY] = useState([]);
  const [pitch, setPitch] = useState([]);

  const height = 2000;
  const width = 5000;

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined' && !audioContext) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
    }

    // Initialize canvas and data
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      // Initialize first root
      const initialRootX = [30];
      const initialRootY = [height / 2];
      const initialPitchData = [new TreeNode(new Data(0, true, false, rootFrequency))];
      initialPitchData[0].setCoordinateX(60);
      initialPitchData[0].setCoordinateY(height / 2);
      const initialPitch = [[0, 0, 0, 0, 0]];

      setRootX(initialRootX);
      setRootY(initialRootY);
      setPitchData(initialPitchData);
      setPitch(initialPitch);
      setSelectedPitchline(initialPitchData[0].getIDPath());

      drawChordDiagram(ctx, initialPitchData, initialRootX, initialRootY, [initialPitchData[0].getIDPath()], 0);
    }
  }, []);

  const drawChordDiagram = useCallback((ctx, pitchDataArray, rootXArray, rootYArray, selectedPath, selectedSideIndex) => {
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#676681';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#a9a9b4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.strokeStyle = '#8d8c9d';
    for (let i = (height / 2) % 160; i < height; i += 160) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw each chord diagram
    for (let i = 0; i < pitchDataArray.length; i++) {
      const rootXPos = rootXArray[i];
      const rootYPos = rootYArray[i];

      // Redraw background for this section
      ctx.fillStyle = '#676681';
      ctx.fillRect(rootXPos, 0, 233, height);

      // Redraw grid lines for this section
      ctx.strokeStyle = '#a9a9b4';
      ctx.beginPath();
      ctx.moveTo(rootXPos, height / 2);
      ctx.lineTo(rootXPos + 233, height / 2);
      ctx.stroke();

      ctx.strokeStyle = '#8d8c9d';
      for (let j = (height / 2) % 160; j < height; j += 160) {
        ctx.beginPath();
        ctx.moveTo(rootXPos, j);
        ctx.lineTo(rootXPos + 233, j);
        ctx.stroke();
      }

      // Draw pitch data
      drawPitchRecursive(ctx, pitchDataArray[i]);

      // Draw root symbol (simplified as circle)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(rootXPos + 15, rootYPos, 10, 0, 2 * Math.PI);
      ctx.fill();

      // Draw pitch line
      const lineColor = pitchDataArray[i].data.isMuted ? '#666666' : '#ffffff';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rootXPos + 30, rootYPos);
      ctx.lineTo(rootXPos + 203, rootYPos);
      ctx.stroke();
    }

    // Highlight selected pitchline
    if (selectedPath.length > 0 && pitchDataArray[selectedSideIndex]) {
      const selectedNode = pitchDataArray[selectedSideIndex].getNodeByPath(selectedPath);
      if (selectedNode) {
        ctx.fillStyle = 'rgba(128, 194, 255, 0.3)';
        ctx.fillRect(selectedNode.getCoordinateX() - 4, selectedNode.getCoordinateY() - 5, 181, 10);
      }
    }
  }, [height, width]);

  const drawPitchRecursive = (ctx, node) => {
    const nodeX = node.getCoordinateX();
    const nodeY = node.getCoordinateY();

    for (const child of node.children) {
      const childX = child.getCoordinateX();
      const childY = child.getCoordinateY();

      // Draw dimension-specific shapes
      const dimension = child.data.dimension;
      const isUp = child.data.isUp;

      if (dimension === 2) {
        ctx.fillStyle = '#f27992'; // Pink for 2D
        if (isUp) {
          ctx.fillRect(nodeX, nodeY - 160, 16, 160);
        } else {
          ctx.fillRect(nodeX, nodeY, 16, 160);
        }
      } else if (dimension === 3) {
        ctx.fillStyle = '#6cd985'; // Green for 3D
        if (isUp) {
          ctx.fillRect(nodeX + 157, nodeY - 90, 16, 90);
        } else {
          ctx.fillRect(nodeX + 157, nodeY, 16, 90);
        }
      } else if (dimension === 4) {
        ctx.fillStyle = '#b795e9'; // Purple for 4D
        const height = 220;
        ctx.beginPath();
        if (isUp) {
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY - height);
          ctx.lineTo(nodeX + 173, nodeY - height);
          ctx.lineTo(nodeX + 16, nodeY);
        } else {
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY + height);
          ctx.lineTo(nodeX + 173, nodeY + height);
          ctx.lineTo(nodeX + 16, nodeY);
        }
        ctx.closePath();
        ctx.fill();
      } else if (dimension === 5) {
        ctx.fillStyle = '#ffc247'; // Yellow for 5D
        const height = 392;
        ctx.beginPath();
        if (isUp) {
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY - height);
          ctx.lineTo(nodeX + 173, nodeY - height);
          ctx.lineTo(nodeX + 16, nodeY);
        } else {
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY + height);
          ctx.lineTo(nodeX + 173, nodeY + height);
          ctx.lineTo(nodeX + 16, nodeY);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw pitch line for child
      const lineColor = child.data.isMuted ? '#666666' : '#ffffff';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(childX, childY);
      ctx.lineTo(childX + 173, childY);
      ctx.stroke();

      // Recursively draw children
      drawPitchRecursive(ctx, child);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log(`Click at X:${x} Y:${y}`);

    for (let i = 0; i < pitchData.length; i++) {
      const searchedNode = pitchData[i].searchCoordinate(x, y);
      if (searchedNode) {
        setSelectedPitchline(searchedNode.getIDPath());
        setSideIndex(i);
        console.log('Selected:', searchedNode.getIDPath());

        const ctx = canvas.getContext('2d');
        drawChordDiagram(ctx, pitchData, rootX, rootY, searchedNode.getIDPath(), i);
        break;
      }
    }
  };

  const handlePitchButtonClick = (dimension, isUp) => {
    if (!pitchData[sideIndex]) return;

    const selectedNode = pitchData[sideIndex].getNodeByPath(selectedPitchline);
    if (!selectedNode) return;

    let howUp = 0;
    let newCoordinate = [selectedNode.getCoordinateX(), selectedNode.getCoordinateY()];
    let frequency = selectedNode.data.frequency;

    // Calculate frequency multipliers and coordinate changes
    const multipliers = {
      2: { up: 3.0000 / 2, down: 2.0000 / 3, offset: 160 },
      3: { up: 5.0000 / 4, down: 4.0000 / 5, offset: 90 },
      4: { up: 7.0000 / 4, down: 4.0000 / 7, offset: 220 },
      5: { up: 11.0000 / 8, down: 8.0000 / 11, offset: 392 }
    };

    const config = multipliers[dimension];
    if (!config) return;

    if (isPitch) {
      // Modify pitch (move root)
      howUp = isUp ? -config.offset : config.offset;
      const newPitch = [...pitch];
      newPitch[sideIndex] = [...newPitch[sideIndex]];
      newPitch[sideIndex][dimension - 1] += isUp ? 1 : -1;
      setPitch(newPitch);

      const newRootY = [...rootY];
      newRootY[sideIndex] += howUp;
      setRootY(newRootY);

      const newPitchData = [...pitchData];
      newPitchData[sideIndex].rootCoordinate(howUp);
      setPitchData(newPitchData);
    } else {
      // Add new note
      newCoordinate[1] += isUp ? -config.offset : config.offset;
      frequency *= isUp ? config.up : config.down;

      const newChild = new TreeNode(new Data(dimension, isUp, false, frequency));
      newChild.setCoordinateX(newCoordinate[0]);
      newChild.setCoordinateY(newCoordinate[1]);

      const newPitchData = [...pitchData];
      newPitchData[sideIndex].getNodeByPath(selectedPitchline).addChild(newChild);
      setPitchData(newPitchData);
    }

    // Redraw
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawChordDiagram(ctx, pitchData, rootX, rootY, selectedPitchline, sideIndex);
    }
  };

  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        console.log('Adding new root');

        const newRootX = [...rootX, rootX[rootX.length - 1] + 233];
        const newRootY = [...rootY, height / 2];
        const newPitchNode = new TreeNode(new Data(0, true, false, rootFrequency));
        newPitchNode.setCoordinateX(newRootX[newRootX.length - 1] + 30);
        newPitchNode.setCoordinateY(newRootY[newRootY.length - 1]);

        const newPitchData = [...pitchData, newPitchNode];
        const newPitch = [...pitch, [0, 0, 0, 0, 0]];

        setRootX(newRootX);
        setRootY(newRootY);
        setPitchData(newPitchData);
        setPitch(newPitch);

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          drawChordDiagram(ctx, newPitchData, newRootX, newRootY, selectedPitchline, sideIndex);
        }
      } else if (event.key === ' ') {
        event.preventDefault();
        // Toggle mute
        const selectedNode = pitchData[sideIndex]?.getNodeByPath(selectedPitchline);
        if (selectedNode) {
          selectedNode.data.setMuted(!selectedNode.data.isMuted);
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            drawChordDiagram(ctx, pitchData, rootX, rootY, selectedPitchline, sideIndex);
          }
        }
      }
    } else if (event.key === 'Shift') {
      setIsPitch(!isPitch);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      const selectedNode = pitchData[sideIndex]?.getNodeByPath(selectedPitchline);
      if (selectedNode) {
        const deleted = pitchData[sideIndex].removeNode(selectedNode);
        if (!deleted) {
          alert('ルート音は削除できません');
        } else {
          setSelectedPitchline(pitchData[sideIndex].getIDPath());
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            drawChordDiagram(ctx, pitchData, rootX, rootY, pitchData[sideIndex].getIDPath(), sideIndex);
          }
        }
      }
    }
  }, [isPitch, pitchData, rootX, rootY, selectedPitchline, sideIndex, pitch, height, rootFrequency]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const playSound = async () => {
    if (!audioContext) return;

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const duration = parseInt(timeField) || 3;
    const allFrequencies = [];

    // Collect frequencies from all pitch data
    for (let i = 0; i < pitchData.length; i++) {
      const frequencies = pitchData[i].returnFrequencies();

      // Apply pitch modifications
      for (let j = 0; j < frequencies.length; j++) {
        let freq = frequencies[j];
        const pitchMods = pitch[i];

        for (let dim = 1; dim <= 4; dim++) {
          const mod = pitchMods[dim];
          if (mod > 0) {
            const multipliers = [0, 3/2, 5/4, 7/4, 11/8];
            freq *= Math.pow(multipliers[dim], mod);
          } else if (mod < 0) {
            const multipliers = [0, 2/3, 4/5, 4/7, 8/11];
            freq *= Math.pow(multipliers[dim], Math.abs(mod));
          }
        }
        frequencies[j] = freq;
      }

      if (frequencies.length > 0) {
        allFrequencies.push(...frequencies);
      }
    }

    if (allFrequencies.length === 0) return;

    // Create oscillators
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.1 / allFrequencies.length, audioContext.currentTime);

    setCurrentGainNode(gainNode);

    const oscillators = allFrequencies.map(freq => {
      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      // Set waveform based on synType
      const waveforms = ['sine', 'sawtooth', 'square', 'triangle'];
      oscillator.type = waveforms[synType] || 'sine';

      return oscillator;
    });

    // Start all oscillators
    oscillators.forEach(osc => osc.start());

    // Stop after duration
    setTimeout(() => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator may already be stopped
        }
      });
      setIsPlaying(false);
      setCurrentGainNode(null);
    }, duration * 1000);
  };

  const handlePlayButton = () => {
    if (isPlaying) {
      // Stop current playback
      if (currentGainNode) {
        currentGainNode.disconnect();
        setCurrentGainNode(null);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playSound();
    }
  };

  const PitchButton = ({ dimension, isUp, label, color }) => (
      <button
          className={`w-20 h-32 ${color} text-white font-bold rounded-lg shadow-lg hover:opacity-80 active:scale-95 transition-all duration-150`}
          onClick={() => handlePitchButtonClick(dimension, isUp)}
          onMouseDown={(e) => e.preventDefault()}
      >
        {label}
      </button>
  );

  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">ValinomCluinata Editor</h1>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <button
                onClick={handlePlayButton}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <input
                type="number"
                value={timeField}
                onChange={(e) => setTimeField(e.target.value)}
                placeholder="和音図再生時間（秒）"
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                min="1"
                max="10"
            />

            <select
                value={synType}
                onChange={(e) => setSynType(parseInt(e.target.value))}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              <option value={0}>Sine</option>
              <option value={1}>Sawtooth</option>
              <option value={2}>Square</option>
              <option value={3}>Triangle</option>
            </select>
          </div>

          <div className="flex gap-4">
            {/* Pitch Controls */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Pitch Controls</h3>
              <div className="text-sm mb-2">Mode: {isPitch ? 'Pitch Shift' : 'Add Note'}</div>
              <div className="text-xs mb-4 text-gray-400">Press Shift to toggle mode</div>

              <div className="grid grid-cols-2 gap-2">
                <PitchButton dimension={2} isUp={true} label="2D ↑" color="bg-pink-500" />
                <PitchButton dimension={3} isUp={true} label="3D ↑" color="bg-green-500" />
                <PitchButton dimension={4} isUp={true} label="4D ↑" color="bg-purple-500" />
                <PitchButton dimension={5} isUp={true} label="5D ↑" color="bg-yellow-500" />

                <PitchButton dimension={2} isUp={false} label="2D ↓" color="bg-pink-600" />
                <PitchButton dimension={3} isUp={false} label="3D ↓" color="bg-green-600" />
                <PitchButton dimension={4} isUp={false} label="4D ↓" color="bg-purple-600" />
                <PitchButton dimension={5} isUp={false} label="5D ↓" color="bg-yellow-600" />
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-96 overflow-auto">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onClick={handleCanvasClick}
                    className="cursor-crosshair"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <div className="text-sm space-y-1 text-gray-300">
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Shift</kbd> - Toggle between Pitch Shift and Add Note modes</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-2 py-1 rounded">→</kbd> - Add new root chord</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-2 py-1 rounded">Space</kbd> - Toggle mute for selected note</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Delete</kbd> - Remove selected note (except root)</div>
              <div>• Click on pitch lines to select them</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ValinomCluinataEditor;