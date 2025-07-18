import React from 'react';

interface BufferToggleProps {
  showBuffers: boolean;
  setShowBuffers: React.Dispatch<React.SetStateAction<boolean>>;
}

const BufferToggle: React.FC<BufferToggleProps> = ({ showBuffers, setShowBuffers }) => {
  return (
    <label className="flex items-center space-x-2 text-sm py-2 px-4 cursor-pointer">
      <input
        type="checkbox"
        checked={showBuffers}
        onChange={() => setShowBuffers(!showBuffers)}
        className="form-checkbox h-4 w-4 text-green-600"
      />
      <span>Побудувати буфери доступності</span>
    </label>
  );
};

export default BufferToggle;