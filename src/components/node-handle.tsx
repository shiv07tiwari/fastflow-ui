import React from 'react';
import {Handle, HandleType, Position} from 'reactflow';

class NodeHandle extends React.Component<{ handles: string[], type: HandleType }> {
    render() {
        const { handles } = this.props;
        const centerOffset = 10; // Base offset for centering
        const spacing = 60; // Space between each handle in pixels

        // Create an array of handles with their respective offsets
        const handleOffsets = handles.map((handle, index) => {
            return {
                translateX: centerOffset + (index - (handles.length - 1) / 2) * spacing,
                id: handle,

            };
        });

        const idPrefix = this.props.type === 'source' ? 'output' : 'input';
        const type = this.props.type === 'source' ? Position.Bottom : Position.Top;

        // Sort the handles by translateX to assign sequential ids from left to right
        handleOffsets.sort((a, b) => a.translateX - b.translateX);

        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                {handleOffsets.map((handle, sortedIndex) => (
                    <Handle
                        key={`handle-${sortedIndex}`}
                        type={this.props.type}
                        position={type}
                        id={handle.id} // Sequential ids from left to right
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