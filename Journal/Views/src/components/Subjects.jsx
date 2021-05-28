import React, { useEffect, useState } from "react";
import { getSubjectsRequest, createSubjectRequest, deleteSubjectRequest } from "../services/subjectsServices";
import ErrorModal from "./ErrorModal";
import Layout from "./Layout";
import Subject from "./Subject";
import SubjectsModal from "./SubjectsModal";
import "../styles/Subjects.css";

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [createEnabled, setCreateEnabled] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);

    useEffect(() => {
        getSubjectsRequest()
            .then(sbjcts => setSubjects(sbjcts));
    }, []);

    useEffect(() => isEmpty(), [subjectName]);

    const isEmpty = () => {
        if (!subjectName.trim()) {
            return setCreateEnabled(true);
        }

        return setCreateEnabled(false);
    }

    const createSubjectHandler = () => {
        const subject = { name: subjectName };

        const error = subjects.some(sbjct => sbjct.name === subjectName);

        if (error) {
            clearInputs();
            return setOpenErrorModal(true);
        }

        return createSubjectRequest(subject)
            .then(() => {
                clearInputs();
                getSubjectsRequest()
                    .then(sbjcts => setSubjects(sbjcts));
            })
            .catch(e => console.log(e));
    }

    const deleteSubjectHandler = () => {
        const subjectId = selectedSubject.id;

        return deleteSubjectRequest(subjectId)
            .then(() => {
                setSelectedSubject(null);
                getSubjectsRequest()
                    .then(sbjcts => setSubjects(sbjcts));
            })
            .catch(e => { throw e });
    }

    const clearInputs = () => {
        setSubjectName("");
    }

    return (
        <Layout>
            {
                openEditModal ? <SubjectsModal setOpenEditModal={setOpenEditModal} 
                                          subject={selectedSubject}
                                          setSubjects={setSubjects}
                                          setSelectedSubject={setSelectedSubject}
                                /> : null 
            }
            { 
                openErrorModal ? <ErrorModal errorText="Предмет с таким названием уже существует!"
                                             setOpenErrorModal={setOpenErrorModal}
                                /> : null 
            }
            <div className="subjects_component">
                <div className="left_side">
                    <h1>Предметы</h1>
                    <div className="subjects">
                        <div className="fields">
                            <div className="field_subject_name">Название предмета</div>
                        </div>
                        <div className="list">
                            { 
                                subjects.sort((a, b) => a.id - b.id)
                                        .map(subject => 
                                    <Subject subject={subject}
                                             selectedSubject={selectedSubject}
                                             setSelectedSubject={setSelectedSubject}
                                             key={subject.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="right_side">
                    <h1>Добавить новый предмет</h1>
                    <input onChange={e => setSubjectName(e.target.value)} 
                        value={subjectName}
                        className="subjectName" 
                        placeholder="Название предмета"
                    />
                    <button onClick={createSubjectHandler} 
                            disabled={createEnabled} 
                            className="add_subject"
                    >
                        Добавить предмет
                    </button>
                    <button onClick={() => setOpenEditModal(true)} 
                            disabled={selectedSubject === null ? true : false} 
                            className="edit_subject"
                    >
                        Редактировать предмет
                    </button>
                    <button onClick={deleteSubjectHandler} 
                            disabled={selectedSubject === null ? true : false} 
                            className="remove_subject"
                    >
                        Удалить предмет
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default Subjects;