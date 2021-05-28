import React, { useEffect, useState } from 'react';
import { editSubjectRequest, getSubjectsRequest } from '../services/subjectsServices';
import "../styles/SubjectsModal.css";

const SubjectsModal = ({ setOpenEditModal, subject, setSubjects, setSelectedSubject }) => {
    const [name, setName] = useState(subject.name);
    const [editEnabled, setEditEnabled] = useState(false);

    useEffect(() => isEmpty(), [name]);

    const isEmpty = () => {
        if (!name.trim()) {
            return setEditEnabled(true);
        }

        return setEditEnabled(false);
    }

    const editSubjectHandler = () => {
        const editedSubject = { ...subject, name };

        return editSubjectRequest(editedSubject)
            .then(() => {
                getSubjectsRequest()
                    .then(sbjcts => {
                        setSubjects(sbjcts);
                        setOpenEditModal(false);
                        setSelectedSubject(null);
                    });
            })
            .catch(e => console.log(e))
    }

    return(
        <div className="modal_subjects">
            <div className="window">
                <div className="inputs">
                    <div className="input_holder">
                        <label>Название предмета</label>
                        <input value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Название предмета" 
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={editSubjectHandler} 
                            className="edit_subject" 
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

export default SubjectsModal;