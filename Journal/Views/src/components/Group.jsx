import React from 'react';
import "../styles/Group.css";

const Group = ({ group, selectedGroup, setSelectedGroup }) => {
    const groupClickHandler = () => {
        if (selectedGroup === group) {
            setSelectedGroup(null);
        } 
        else {
            setSelectedGroup(group);
        }
    }

    return (
        <div onClick={groupClickHandler} 
             className={group === selectedGroup ? "group active" : "group"}
        >
            <div className="existing_group">{ group.name }</div>
        </div>
    )
}

export default Group;