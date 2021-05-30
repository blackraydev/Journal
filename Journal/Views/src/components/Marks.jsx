import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Mark from "./Mark";
import { getScheduleRequest } from '../services/scheduleServices';
import { getUsersRequest } from '../services/usersServices';
import { getStudentsRequest } from '../services/studentsServices';
import { getGroupsRequest } from '../services/groupsServices';
import { getSubjectsRequest } from '../services/subjectsServices';
import { getMarksRequest, createMarkRequest, deleteMarkRequest } from '../services/marksServices';
import "../styles/Marks.css";
import MarksModal from './MarksModal';
import { useHistory } from 'react-router';

const Marks = () => {
    const lessonId = localStorage.getItem("lessonId");
    const [lessons, setLessons] = useState([]);
    const [groups, setGroups] = useState([]);
    const [marks, setMarks] = useState([]);
    const [groupMarks, setGroupMarks] = useState([]);
    const [users, setUsers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [groupStudents, setGroupStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [remainingStudents, setRemainingStudents] = useState([]);
    const [selectedMark, setSelectedMark] = useState(null);
    const [studentId, setStudentId] = useState(1);
    const [mark, setMark] = useState(1);
    
    const [createEnabled, setCreateEnabled] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const history = useHistory();

    const [lesson, setLesson] = useState({});
    const [group, setGroup] = useState({});
    const [teacher, setTeacher] = useState({});
    const [subject, setSubject] = useState({});

    useEffect(() => {
        getMarksRequest().then(mrks => setMarks(mrks));
        getScheduleRequest().then(lssns => setLessons(lssns));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getUsersRequest().then(usrs => {
            const filteredStudents = usrs.filter(usr => usr.role == "Студент");
            const filteredTeachers = usrs.filter(usr => usr.role == "Преподаватель");
            setStudents(filteredStudents);
            setTeachers(filteredTeachers);
        });
    }, []);

    useEffect(() => {
        if (marks) {
            const filteredMarks = marks.filter(mrk => mrk.lessonId == lessonId);
            setGroupMarks(filteredMarks);
        }
    }, [marks]);

    useEffect(() => {
        if (lessons) {
            setLesson(lessons.find(lssn => lssn.id == lessonId))
        }
    }, [lessons]);

    useEffect(() => {
        if (groups && lesson) {
            setGroup(groups.find(grp => grp.id == lesson.groupId))
        }
    }, [groups, lesson]);

    useEffect(() => {
        if (subjects && lesson) {
            setSubject(subjects.find(sbjct => sbjct.id == lesson.subjectId))
        }
    }, [subjects, lesson]);

    useEffect(() => {
        if (teachers && lesson) {
            setTeacher(teachers.find(tchr => tchr.id == lesson.teacherId))
        }
    }, [teachers, lesson]);

    useEffect(() => {
        if (group && group.id) {
            getStudentsRequest(group.id).then(stdnts => setGroupStudents(stdnts));
        }
    }, [group])

    useEffect(() => {
        if (students) {
            const filteredStudents = students.filter(stdnt => groupStudents.includes(stdnt.id));
            setAvailableStudents(filteredStudents);
        }
    }, [students, groupStudents]);

    useEffect(() => {
        if (availableStudents) {
            const markedStudentsId = groupMarks.map(groupMark => groupMark.studentId);
            const filteredRemainingStudents = availableStudents.filter(avStudent => !markedStudentsId.includes(avStudent.id));
            setRemainingStudents(filteredRemainingStudents);
        }
    }, [groupMarks, availableStudents]);

    useEffect(() => {
        if (remainingStudents && remainingStudents[0]) {
            setStudentId(remainingStudents[0].id);
        }
    }, [remainingStudents]);

    useEffect(() => {
        if (remainingStudents.length) {
            return setCreateEnabled(false);
        }

        return setCreateEnabled(true);
    }, [remainingStudents]);

    const createMarkHandler = () => {
        const newMark = { lessonId, studentId, mark, subjectId: subject.id };

        return createMarkRequest(newMark)
            .then(() => {
                getMarksRequest()
                    .then(marks => {
                        setMarks(marks);
                    });
            })
    }

    const deleteMarkHandler = () => {
        const markId = selectedMark.id;

        return deleteMarkRequest(markId)
            .then(() => {
                setSelectedMark(null);
                getMarksRequest()
                    .then(mrks => setMarks(mrks));
            })
            .catch(e => { throw e });
    }

    const goToHomeworks = () => history.push(`/main/schedule/${lessonId}/homework`);

    return (
        <Layout>
            {
                openEditModal ? <MarksModal setOpenEditModal={setOpenEditModal} 
                                            mark={selectedMark}
                                            setMarks={setMarks}
                                            setSelectedMark={setSelectedMark}
                                /> : null 
            }
            <div className="marks_component">
                <div className="left_side">
                    <h1>
                        {
                            `${group && group.name} - 
                             ${teacher && teacher.fullName} - 
                             ${subject && subject.name} - 
                             ${lesson && lesson.date && lesson.date.substr(0, 10)}`
                        }
                    </h1>
                    <div className="marks">
                        <div className="fields">
                            <div className="field_student">Студент</div>
                            <div className="field_mark">Оценка</div>
                        </div>
                        <div className="list">
                            {
                                groupMarks.map(mark => 
                                    <Mark mark={mark}
                                          selectedMark={selectedMark}
                                          setSelectedMark={setSelectedMark}
                                          key={mark.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="right_side">
                    <h1>Выставить оценку</h1>
                    <select className="selector" onChange={e => setStudentId(e.target.value)}>
                        {
                            remainingStudents.length ?
                                remainingStudents.map((remainingStudent, index) => 
                                    <option value={remainingStudent.id}
                                            key={remainingStudent.id}
                                            selected={index == 0 ? true : false}
                                    >
                                        { remainingStudent.fullName }
                                    </option>)
                            : <option>Нет доступных студентов</option>
                        }
                    </select>
                    <select className="selector" onChange={e => setMark(e.target.value)}>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Не явка", "Болен"].map((elem, index) => 
                                <option value={ elem } 
                                        selected={index == 0}
                                        key={index}
                                >
                                    { elem }
                                </option>
                            )
                        }
                    </select>
                    <button onClick={createMarkHandler} 
                            disabled={createEnabled} 
                            className="add_mark"
                    >
                        Выставить оценку
                    </button>
                    <button onClick={() => setOpenEditModal(true)} 
                            disabled={selectedMark === null ? true : false} 
                            className="edit_mark"
                    >
                        Редактировать оценку
                    </button>
                    <button onClick={deleteMarkHandler} 
                            disabled={selectedMark === null ? true : false} 
                            className="remove_mark"
                    >
                        Удалить оценку
                    </button>
                    <button onClick={goToHomeworks} 
                            className="go_to_homeworks"
                    >
                        Домашние работы
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Marks;