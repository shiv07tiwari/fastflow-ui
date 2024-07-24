import React from 'react';
import {Handle, HandleType, Position} from 'reactflow';

interface NodeHandleProps {
    handles: string[];
    type: HandleType;
}

class NodeHandle extends React.Component<NodeHandleProps> {
    render() {
        const {handles, type} = this.props;
        const centerOffset = 10; // Base offset for centering
        const spacing = 60; // Space between each handle in pixels

        // Create an array of handles with their respective offsets
        const handleOffsets = handles.map((handle, index) => {
            return {
                translateX: centerOffset + (index - (handles.length - 1) / 2) * spacing,
                id: handle,
            };
        });

        const position = type === 'source' ? Position.Bottom : Position.Top;

        // Sort the handles by translateX to assign sequential ids from left to right
        handleOffsets.sort((a, b) => a.translateX - b.translateX);

        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}} className="d-flex bg-transparent">
                {handleOffsets.map((handle, sortedIndex) => (
                    <div
                        key={`handle-wrapper-${sortedIndex}`}
                        style={{
                            left: '50%',
                            width: '100%',
                            transform: `translateX(${handle.translateX}px)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Handle
                            type={this.props.type}
                            position={position}
                            id={handle.id}
                            style={{
                                background: type === 'source' ? '#4a90e2' : '#333333',
                                width: '12px',
                                height: '12px',
                                overflow: 'visible',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '10px',
                                marginTop: this.props.type === 'source' ? '4px' : '12px',
                                marginBottom: this.props.type === 'source' ? '12px' : '4px',
                                pointerEvents: 'none',
                            }}
                        >
              {handle.id}
            </span>
                    </div>
                ))}
            </div>
        );
    }
}

export default NodeHandle;