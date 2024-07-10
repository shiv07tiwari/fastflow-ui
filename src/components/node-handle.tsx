import React from 'react';
import { Handle, Position } from 'reactflow';

class NodeHandle extends React.Component<{ input_handles: number }> {
    render() {
        const { input_handles } = this.props;
        const centerOffset = 10; // Base offset for centering
        const spacing = 60; // Space between each handle in pixels

        // Create an array of handles with their respective offsets
        const handleOffsets = Array.from({length: input_handles}).map((_, index) => {
            // Calculate offset to distribute handles symmetrically from the center
            const offsetMultiplier = Math.floor((index + 1) / 2);
            const directionMultiplier = (index % 2 === 0) ? 1 : -1;
            const translateX = centerOffset + (offsetMultiplier * spacing * directionMultiplier);
            return {
                id: index, // Original index for sorting purposes
                translateX
            };
        });

        // Sort the handles by translateX to assign sequential ids from left to right
        handleOffsets.sort((a, b) => a.translateX - b.translateX);

        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                {handleOffsets.map((handle, sortedIndex) => (
                    <Handle
                        key={`handle-${sortedIndex}`}
                        type="target"
                        position={Position.Top}
                        id={`input${sortedIndex + 1}`} // Sequential ids from left to right
                        style={{
                            background: '#4a90e2',
                            width: '12px',
                            height: '12px',
                            overflow: 'visible',
                            left: '50%', // Start from the center
                            transform: `translateX(${handle.translateX}px)`, // Position handle relative to center
                        }}
                    />
                ))}
            </div>
        );
    }
}

export default NodeHandle;