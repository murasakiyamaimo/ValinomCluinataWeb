import React, { useState } from 'react';

interface ToggleSwitchProps {
    initialState?: boolean; // 初期状態 (オプション)
    onToggle?: (isOn: boolean) => void; // トグル時のコールバック
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ initialState = false, onToggle }) => {
    const [isOn, setIsOn] = useState<boolean>(initialState);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        onToggle?.(newState); // コールバックがあれば呼び出す
    };

    return (
        <button
            onClick={handleToggle}
            className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isOn ? 'bg-indigo-600 focus:ring-indigo-500' : 'bg-gray-200 focus:ring-gray-300'}
      `}
            role="switch"
            aria-checked={isOn}
        >
      <span
          className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
          ${isOn ? 'translate-x-6' : 'translate-x-1'}
        `}
          aria-hidden="true" // スクリーンリーダーが読み上げないように
      />
        </button>
    );
};

export default ToggleSwitch;