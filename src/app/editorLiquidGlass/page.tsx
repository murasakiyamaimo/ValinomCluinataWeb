"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X , Pause, Play } from 'lucide-react';
import TreeNode from "../../utils/TreeNode";
import Data from "../../utils/Data";
import LiquidGlassCard from "@/components/LiquidGlassCard";

interface PitchButtonProps {
  dimension: number;
  isUp: boolean;
  label: string;
  color: string;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext; // すべてのブラウザにあるわけではないので、オプションにする
  }
}

const ValinomCluinataEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPitch, setIsPitch] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [synType, setSynType] = useState<number>(0);
  const [timeField, setTimeField] = useState<string>('3');
  const [selectedPitchline, setSelectedPitchline] = useState<number[]>([]);
  const [sideIndex, setSideIndex] = useState<number>(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [currentGainNode, setCurrentGainNode] = useState<GainNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  const rootFrequency: number = Math.pow(2, 0.25) * 220;
  const [pitchData, setPitchData] = useState<TreeNode[]>([]);
  const [rootX, setRootX] = useState<number[]>([]);
  const [rootY, setRootY] = useState<number[]>([]);
  const [pitch, setPitch] = useState<number[][]>([]);

  const height: number = 2000;
  const width: number = 5000;

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
      if (!ctx) return;

      // Initialize first root
      const initialRootX: number[] = [250];
      const initialRootY: number[] = [height / 2];
      const initialPitchData: TreeNode[] = [new TreeNode(new Data(0, true, false, rootFrequency))];
      initialPitchData[0].setCoordinateX(280);
      initialPitchData[0].setCoordinateY(height / 2);
      const initialPitch: number[][] = [[0, 0, 0, 0, 0]];

      setRootX(initialRootX);
      setRootY(initialRootY);
      setPitchData(initialPitchData);
      setPitch(initialPitch);
      setSelectedPitchline(initialPitchData[0].getIDPath());

      drawChordDiagram(ctx, initialPitchData, initialRootX, initialRootY, [initialPitchData[0].getIDPath()], 0);
    }
  }, []);

  const drawChordDiagram = useCallback((
      ctx: CanvasRenderingContext2D,
      pitchDataArray: TreeNode[],
      rootXArray: number[],
      rootYArray: number[],
      selectedPath: number[][],
      selectedSideIndex: number
  ) => {
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
      const rootXPos: number = rootXArray[i];
      const rootYPos: number = rootYArray[i];

      // Redraw the background for this section
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
      ctx.setLineDash(pitchDataArray[i].data.isMuted ? [5, 5] : []);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rootXPos + 30, rootYPos);
      ctx.lineTo(rootXPos + 203, rootYPos);
      ctx.stroke();
    }

    // Highlight selected pitchline
    if (selectedPath.length > 0 && pitchDataArray[selectedSideIndex]) {
      const selectedNode = pitchDataArray[selectedSideIndex].getNodeByPath(selectedPath[0]);
      if (selectedNode) {
        ctx.fillStyle = 'rgba(128, 194, 255, 0.3)';
        ctx.fillRect(selectedNode.getCoordinateX() - 4, selectedNode.getCoordinateY() - 5, 181, 10);
      }
    }
  }, [height, width]);

  const drawPitchRecursive = (ctx: CanvasRenderingContext2D, node: TreeNode): void => {
    const nodeX: number = node.getCoordinateX();
    const nodeY: number = node.getCoordinateY();

    for (const child of node.children) {
      const childX: number = child.getCoordinateX();
      const childY: number = child.getCoordinateY();

      // Draw dimension-specific shapes
      const dimension: number = child.data.dimension;
      const isUp: boolean = child.data.isUp;

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
        const height: number = 220;
        ctx.beginPath();
        if (isUp) {
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY - height);
          ctx.lineTo(nodeX + 173, nodeY - height);
          ctx.lineTo(nodeX + 16, nodeY);
        } else {
          ctx.moveTo(nodeX, nodeY + height);
          ctx.lineTo(nodeX + 157, nodeY);
          ctx.lineTo(nodeX + 173, nodeY);
          ctx.lineTo(nodeX + 16, nodeY + height);
        }
        ctx.closePath();
        ctx.fill();
      } else if (dimension === 5) {
        ctx.fillStyle = '#ffc247'; // Yellow for 5D
        const height: number = 392;
        ctx.beginPath();
        if (isUp) {
          ctx.moveTo(nodeX + 173, nodeY);
          ctx.lineTo(nodeX + 16, nodeY - height);
          ctx.lineTo(nodeX, nodeY - height);
          ctx.lineTo(nodeX + 157, nodeY);
        } else {
          ctx.moveTo(nodeX + 173, nodeY + height);
          ctx.lineTo(nodeX + 16, nodeY);
          ctx.lineTo(nodeX, nodeY);
          ctx.lineTo(nodeX + 157, nodeY + height);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw pitch line for child
      ctx.setLineDash(child.data.isMuted ? [5, 5] : []);
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(childX, childY);
      ctx.lineTo(childX + 173, childY);
      ctx.stroke();

      // Recursively draw children
      drawPitchRecursive(ctx, child);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x: number = event.clientX - rect.left;
    const y: number = event.clientY - rect.top;

    console.log(`Click at X:${x} Y:${y}`);

    for (let i = 0; i < pitchData.length; i++) {
      const searchedNode = pitchData[i].searchCoordinate(x, y);
      if (searchedNode) {
        setSelectedPitchline(searchedNode.getIDPath());
        setSideIndex(i);
        console.log('Selected:', searchedNode.getIDPath());

        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawChordDiagram(ctx, pitchData, rootX, rootY, [searchedNode.getIDPath()], i);
        }
        break;
      }
    }
  };

  const handlePitchButtonClick = (dimension: number, isUp: boolean): void => {
    if (!pitchData[sideIndex]) return;

    const selectedNode = pitchData[sideIndex].getNodeByPath(selectedPitchline);
    if (!selectedNode) return;

    let howUp: number = 0;
    const newCoordinate: number[] = [selectedNode.getCoordinateX(), selectedNode.getCoordinateY()];
    let frequency: number = selectedNode.data.frequency;

    // Calculate frequency multipliers and coordinate changes
    interface MultiplierConfig {
      up: number;
      down: number;
      offset: number;
    }

    const multipliers: Record<number, MultiplierConfig> = {
      2: { up: 3.0000 / 2, down: 2.0000 / 3, offset: 160 },
      3: { up: 5.0000 / 4, down: 4.0000 / 5, offset: 90 },
      4: { up: 7.0000 / 4, down: 4.0000 / 7, offset: 220 },
      5: { up: 11.0000 / 4, down: 4.0000 / 11, offset: 392 }
    };

    const config = multipliers[dimension];
    if (!config) return;

    const newRootY: number[] = [...rootY];

    if (isPitch) {
      // Modify pitch (move root)
      howUp = isUp ? -config.offset : config.offset;
      const newPitch: number[][] = [...pitch];
      newPitch[sideIndex] = [...newPitch[sideIndex]];
      newPitch[sideIndex][dimension - 1] += isUp ? 1 : -1;
      setPitch(newPitch);

      newRootY[sideIndex] += howUp;
      setRootY(newRootY);

      const newPitchData: TreeNode[] = [...pitchData];
      newPitchData[sideIndex].rootCoordinate(howUp);
      setPitchData(newPitchData);
    } else {
      // Add new note
      newCoordinate[1] += isUp ? -config.offset : config.offset;
      frequency *= isUp ? config.up : config.down;

      const newChild = new TreeNode(new Data(dimension, isUp, false, frequency));
      newChild.setCoordinateX(newCoordinate[0]);
      newChild.setCoordinateY(newCoordinate[1]);

      const newPitchData: TreeNode[] = [...pitchData];
      newPitchData[sideIndex]?.getNodeByPath(selectedPitchline)?.addChild(newChild);
      setPitchData(newPitchData);
    }

    // Redraw
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawChordDiagram(ctx, pitchData, rootX, newRootY, [selectedPitchline], sideIndex);
      }
    }
  };

  const handleKeyDown = useCallback((event: KeyboardEvent): void => {
    if (event.ctrlKey) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        console.log('Adding new root');

        const newRootX: number[] = [...rootX, rootX[rootX.length - 1] + 233];
        const newRootY: number[] = [...rootY, height / 2];
        const newPitchNode = new TreeNode(new Data(0, true, false, rootFrequency));
        newPitchNode.setCoordinateX(newRootX[newRootX.length - 1] + 30);
        newPitchNode.setCoordinateY(newRootY[newRootY.length - 1]);

        const newPitchData: TreeNode[] = [...pitchData, newPitchNode];
        const newPitch: number[][] = [...pitch, [0, 0, 0, 0, 0]];

        setRootX(newRootX);
        setRootY(newRootY);
        setPitchData(newPitchData);
        setPitch(newPitch);

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawChordDiagram(ctx, newPitchData, newRootX, newRootY, [selectedPitchline], sideIndex);
          }
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
            if (ctx) {
              drawChordDiagram(ctx, pitchData, rootX, rootY, [selectedPitchline], sideIndex);
            }
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
            if (ctx) {
              drawChordDiagram(ctx, pitchData, rootX, rootY, [pitchData[sideIndex].getIDPath()], sideIndex);
            }
          }
        }
      }
    }
  }, [isPitch, pitchData, rootX, rootY, selectedPitchline, sideIndex, pitch, height, rootFrequency]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const playSound = async (): Promise<void> => {
    if (!audioContext) return;

    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const duration: number = parseInt(timeField) || 3;
    const allFrequencies: number[] = [];

    // Collect frequencies from all pitch data
    for (let i = 0; i < pitchData.length; i++) {
      const frequencies: number[] = pitchData[i].returnFrequencies();

      // Apply pitch modifications
      for (let j = 0; j < frequencies.length; j++) {
        let freq: number = frequencies[j];
        const pitchMods: number[] = pitch[i];

        for (let dim = 1; dim <= 4; dim++) {
          const mod: number = pitchMods[dim];
          if (mod > 0) {
            const multipliers: number[] = [0, 3/2, 5/4, 7/4, 11/4];
            freq *= Math.pow(multipliers[dim], mod);
          } else if (mod < 0) {
            const multipliers: number[] = [0, 2/3, 4/5, 4/7, 4/11];
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
    const gainNode: GainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.1 / allFrequencies.length, audioContext.currentTime);

    setCurrentGainNode(gainNode);

    const oscillators: OscillatorNode[] = allFrequencies.map((freq: number) => {
      const oscillator: OscillatorNode = audioContext.createOscillator();
      oscillator.connect(gainNode);
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      // Set waveform based on synType
      const waveforms: OscillatorType[] = ['sine', 'sawtooth', 'square', 'triangle'];
      oscillator.type = waveforms[synType] || 'sine';

      return oscillator;
    });

    // Start all oscillators
    oscillators.forEach((osc: OscillatorNode) => osc.start());

    // Stop after duration
    setTimeout(() => {
      oscillators.forEach((osc: OscillatorNode) => {
        try {
          osc.stop();
        } catch (e) {
          if (e instanceof Error) {
            setError(e.toString());
          } else {
            setError(String(e));
          }
        }
      });
      setIsPlaying(false);
      setCurrentGainNode(null);
    }, duration * 1000);
  };

  const handlePlayButton = (): void => {
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

  const PitchButton: React.FC<PitchButtonProps> = ({ dimension, isUp, label, color }) => (
      <button
          className={`w-20 h-32 ${color} text-white font-bold rounded-lg shadow-lg hover:opacity-80 active:scale-95 transition-all duration-150`}
          onClick={() => handlePitchButtonClick(dimension, isUp)}
          onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      >
        {label}
      </button>
  );

  return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="p-4">
          {error ? <div className="px-5 p-2 border border-white rounded-md bg-pink-700 flex justify-between ">
            <a>Error: {error}</a>
            <button onClick={() => {
              setError(null)
            }}><X/></button>
          </div> : <div />}

          <h1 className="py-2 text-2xl font-bold mb-1">ValinomCluinata Editor</h1>

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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimeField(e.target.value)}
                placeholder="和音図再生時間（秒）"
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                min="1"
                max="10"
            />

            <select
                value={synType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSynType(parseInt(e.target.value))}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            >
              <option value={0}>Sine</option>
              <option value={1}>Sawtooth</option>
              <option value={2}>Square</option>
              <option value={3}>Triangle</option>
            </select>
          </div>

          <div className="relative flex h-190">

            {/* Canvas */}
            <div className="absolute inset-0 rounded-lg overflow-auto self-stretch" id="canvas-container">
              <canvas
                  ref={canvasRef}
                  width={width}
                  height={height}
                  onClick={handleCanvasClick}
                  className="cursor-crosshair"
              />
            </div>

            {/* Pitch Controls */}
            <div className="absolute left-3 h-full rounded-lg overflow-auto self-stretch flex items-center justify-center">
              <LiquidGlassCard className="rounded-lg " id="pitch-controls">
                <h3 className="text-lg font-semibold mb-4">コントロール</h3>
                <div className="text-sm mb-2">モード: {isPitch ? 'ルート変更' : '音符を追加'}</div>
                <div className="text-xs mb-4 text-gray-400">Shiftで切り替わります</div>

                <div className="grid grid-cols-2 gap-2">
                  <PitchButton dimension={2} isUp={true} label="2D ↑" color="bg-pink-500"/>
                  <PitchButton dimension={3} isUp={true} label="3D ↑" color="bg-green-500"/>
                  <PitchButton dimension={4} isUp={true} label="4D ↑" color="bg-purple-500"/>
                  <PitchButton dimension={5} isUp={true} label="5D ↑" color="bg-yellow-500"/>

                  <PitchButton dimension={2} isUp={false} label="2D ↓" color="bg-pink-600"/>
                  <PitchButton dimension={3} isUp={false} label="3D ↓" color="bg-green-600"/>
                  <PitchButton dimension={4} isUp={false} label="4D ↓" color="bg-purple-600"/>
                  <PitchButton dimension={5} isUp={false} label="5D ↓" color="bg-yellow-600"/>
                </div>
              </LiquidGlassCard>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">説明</h3>
            <div className="text-sm space-y-1 text-gray-300">
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Shift</kbd> - モードを切り替えます</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-2 py-1 rounded">→</kbd> - 新しい和音図を作成します</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-2 py-1 rounded">Space</kbd> - ミュートを切り替えます</div>
              <div>• <kbd className="bg-gray-700 px-2 py-1 rounded">Delete</kbd> - 音符を削除します</div>
              <div>• クリックして音符を選択できます</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ValinomCluinataEditor;