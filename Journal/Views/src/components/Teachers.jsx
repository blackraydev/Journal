import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Teacher from "./Teacher";
import Subject from "./Subject";
import { getSubjectsRequest } from "../services/subjectsServices";
import { createTeacherSubjectRequest, deleteTeacherSubjectRequest, getTeacherSubjectsRequest } from "../services/teacherSubjectsServices";
import { getUsersRequest } from "../services/usersServices";
import GroupsModal from "./GroupsModal";
import ErrorModal from "./ErrorModal";
import Student from "./Student";
import "../styles/Teachers.css";

const Teachers = () => {
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);

    const [teachers, setTeachers] = useState([]);
    const [targetSubjects, setTargetSubjects] = useState([]);
    const [subjectToShow, setSubjectToShow] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjectId, setSubjectId] = useState(0);

    const [addEnabled, setAddEnabled] = useState(false);

    useEffect(() => {
        getUsersRequest().then(usrs => setUsers(usrs));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getTeacherSubjectsRequest().then(tSubjects => setTeacherSubjects(tSubjects));
    }, []);

    useEffect(() => {
        if (users) {
            const filteredTeachers = users.filter(user => user.role == "Преподаватель");
            setTeachers(filteredTeachers);
        }
    }, [users]);

    useEffect(() => {
        if (teacherSubjects && subjects && selectedTeacher) {
            const tempTeacherSubjects = teacherSubjects.filter(tSubjects => tSubjects.teacherId == selectedTeacher.id);
            const teacherSubjectsId = tempTeacherSubjects.map(tSubjects => tSubjects.subjectId);
            setTargetSubjects(subjects.filter(sbjct => teacherSubjectsId.includes(sbjct.id)));
        }
    }, [teacherSubjects, subjects, selectedTeacher]);

    useEffect(() => {
        if (targetSubjects && selectedTeacher) {
            const tempTeacherSubjects = teacherSubjects.filter(tSubjects => tSubjects.teacherId == selectedTeacher.id);
            const teacherSubjectsId = tempTeacherSubjects.map(tSubjects => tSubjects.subjectId);
            setSubjectToShow(subjects.filter(sbjct => !teacherSubjectsId.includes(sbjct.id)));
        }
        else if (!selectedTeacher) {
            setSubjectToShow([]);
        }
    }, [targetSubjects]);

    useEffect(() => {
        if (!selectedTeacher) {
            setTargetSubjects([]);
        }

        setSelectedSubject(null);
    }, [selectedTeacher]);

    useEffect(() => {
        if (subjectToShow.length) {
            return setAddEnabled(false);
        }

        return setAddEnabled(true);
    }, [subjectToShow, selectedSubject]);

    useEffect(() => {
        if (subjectToShow && subjectToShow[0] && subjectToShow[0].id) {
            setSubjectId(subjectToShow[0].id);
        }
    }, [subjectToShow]);

    const addSubjectToTeacherHandler = () => {
        const teacherSubject = { subjectId: subjectId, teacherId: selectedTeacher.id };

        return createTeacherSubjectRequest(teacherSubject)
            .then(() => {
                getTeacherSubjectsRequest()
                    .then(tSubjects => {
                        setTeacherSubjects(tSubjects);
                    });
            })
    }

    const removeSubjectFromTeacherHandler = () => {
        const teacherSubject = { subjectId: selectedSubject.id, teacherId: selectedTeacher.id };

        return deleteTeacherSubjectRequest(teacherSubject)
            .then(() => {
                getTeacherSubjectsRequest()
                    .then(tSubjects => {
                        setTeacherSubjects(tSubjects);
                    });
                setSelectedSubject(null);
            })
    }

    return (
        <Layout>
            <div className="teachers_component">
                <div className="left_side">
                    <h1>Преподаватели</h1>
                    <div className="teachers">
                        <div className="fields">
                            <div className="field_teacher">Преподаватель</div>
                        </div>
                        <div className="list">
                            {
                                teachers.map(teacher => 
                                    <Teacher teacher={teacher}
                                           selectedTeacher={selectedTeacher}
                                           setSelectedTeacher={setSelectedTeacher}
                                           key={teacher.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="middle_side">
                    <h1>Предметы</h1>
                    <div className="subjects">
                        <div className="fields">
                            <div className="field_subject">Предмет</div>
                        </div>
                        <div className="list">
                            {
                                targetSubjects.map(subject => 
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
                    <div className="top_part">
                        <h1>Добавить предмет</h1>
                        <select className="selector" onChange={e => setSubjectId(e.target.value)}>
                            {
                                subjectToShow.length ?
                                    subjectToShow.map(subject => 
                                        <option value={subject.id}
                                                key={subject.id}
                                        >
                                            { subject.name }
                                        </option>)
                                : <option>Нет доступных предметов</option>
                            }
                        </select>
                        <button onClick={addSubjectToTeacherHandler} 
                                disabled={addEnabled} 
                                className="add_subject"
                        >
                            Добавить предмет
                        </button>
                        <button onClick={removeSubjectFromTeacherHandler} 
                                disabled={selectedSubject === null ? true : false} 
                                className="remove_subject"
                        >
                            Удалить предмет
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Teachers;