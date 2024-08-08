import {MdOutlineAdd} from "react-icons/md";
import React from "react";
import {BaseNode} from "../types";

interface NodeCardProps {
    node: BaseNode;
    size: 'large' | 'small';
    onSelect: (id: BaseNode) => void;
}
const NodeCard = ({node, size,onSelect}: NodeCardProps) => {
  if (size === 'large') {
    return (
         // <User
        //     className="m-1 w-100 align-items-center items-start justify-content-start"
        //     name={node.name}
        //     style={{height:'80px'}}
        //     description={node.description}
        //     avatarProps={{
        //         src: `/node-icons/${node.id}.png`,
        //         className: "w-16 h-16  mr-3",
        //         isBordered: true,
        //     }}
        // />
      <div className="card shadow m-2 align-items-center" style={{ width: '12rem', borderRadius: '20px' }}>
          <div className="text-white text-center py-3" style={{borderRadius: '20px 20px 0 0'}}>
              <img src={`/node-icons/${node.id}.png`} alt={""} className="mr-3"
                   style={{width: "48px", height: "48px", "marginRight": '8px'}}/>
          </div>
          <div className="card-body d-flex flex-column">
              <div className="mb-2" style={{height: '24px'}}>
                  <div className="card-title text-truncate">{node.name}</div>
              </div>
              <div className="flex-grow-1 mb-2" style={{minHeight: '12px'}}>
                  <small className="card-text">{node.description}</small>
              </div>
              <button
                  style={{backgroundColor: '#829cde', border: 'none', borderRadius: '20px'}}
                  onClick={() => onSelect(node)}
                  className="btn custom-gradient-btn w-100 text-white fw-bold">
                  Add +
              </button>
          </div>
      </div>
    );
  } else if (size === 'small') {
      return (
          <div className="d-flex align-items-center border m-1"
               style={{width: '32rem', padding: '10px', borderRadius: '20px'}}>
              <img src={`/node-icons/ai.png`} alt={""} className="mr-3"
                   style={{width: '40px', height: '40px', margin: '0 10px'}}/>
            <div className="flex-grow-1">
                <h5>Heading</h5>
                <p className="mb-0 text-secondary">Subheading</p>
            </div>
            <button className="btn text-dark" style={{
                fontSize: '24px',
                backgroundColor: '#829cde',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <MdOutlineAdd />
            </button>
        </div>
    );
  } else {
      return <div>Invalid size property</div>;
  }
};

export default NodeCard;
