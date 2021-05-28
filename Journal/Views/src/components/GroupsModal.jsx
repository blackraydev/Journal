import React, { useEffect, useState } from 'react';
import { editGroupRequest, getGroupsRequest } from '../services/groupsServices';
import "../styles/GroupsModal.css";

const GroupsModal = ({ setOpenEditModal, group, setGroups, setSelectedGroup }) => {
    const [name, setName] = useState(group.name);
    const [editEnabled, setEditEnabled] = useState(false);

    useEffect(() => isEmpty(), [name]);

    const isEmpty = () => {
        if (!name.trim()) {
            return setEditEnabled(true);
        }

        return setEditEnabled(false);
    }

    const editGroupHandler = () => {
        const editedGroup = { ...group, name };

        return editGroupRequest(editedGroup)
            .then(() => {
                getGroupsRequest()
                    .then(grps => {
                        setGroups(grps);
                        setOpenEditModal(false);
                        setSelectedGroup(null);
                    });
            })
            .catch(e => console.log(e))
    }

    return (
        <div className="modal_groups">
            <div className="window">
                <div className="inputs">
                    <div className="input_holder">
                        <label>Название группы</label>
                        <input value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Название группы" 
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={editGroupHandler} 
                            className="edit_group" 
                            disabled={editEnabled}
                    >
                        Редактировать название
                    </button>
                    <button onClick={() => setOpenEditModal(false)} 
                            className="cancel"
                    >
                        Отменить
                    </button>
                </div>
            </div>
            <div className="overlay"/>
        </div>
    )
}

export default GroupsModal;
