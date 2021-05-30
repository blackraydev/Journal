import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import Lesson from "./Lesson";
import { getGroupsRequest } from "../services/groupsServices";
import { getUsersRequest } from "../services/usersServices";
import { getSubjectsRequest } from "../services/subjectsServices";
import { getTeacherSubjectsRequest } from "../services/teacherSubjectsServices";
import { createScheduleRequest, deleteScheduleRequest, getScheduleRequest } from '../services/scheduleServices';
import "../styles/Schedule.css";
import ScheduleModal from './ScheduleModal';
import ErrorModal from './ErrorModal';
import { Link } from 'react-router-dom';

const Schedule = () => {
    const [lessonId, setLessonId] = useState(0);
    const [lessons, setLessons] = useState([]);
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [currentSubjects, setCurrentSubjects] = useState([]);
    const [groupId, setGroupId] = useState(1);
    const [teacherId, setTeacherId] = useState(1);
    const [subjectId, setSubjectId] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [theme, setTheme] = useState("");
    const [homework, setHomework] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [createEnabled, setCreateEnabled] = useState(false);

    useEffect(() => {
        getScheduleRequest().then(schdl => setLessons(schdl));
        getTeacherSubjectsRequest().then(tchrSbjcts => setTeacherSubjects(tchrSbjcts));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getUsersRequest().then(usrs => {
            const filteredTeachers = usrs.filter(usr => usr.role == "Преподаватель");
            setTeachers(filteredTeachers);
        });
    }, []);

    useEffect(() => {
        if (groups && groups[0]) {
            setGroupId(groups[0].id);
        }
    }, [groups]);

    useEffect(() => {
        if (teachers && teachers[0]) {
            setTeacherId(teachers[0].id);
        }
    }, [teachers]);

    useEffect(() => {
        if (selectedLesson) {
            setLessonId(selectedLesson.id);
        }
    }, [selectedLesson])

    useEffect(() => {
        if (teacherSubjects) {
            const targetSubjects = teacherSubjects.filter(teacherSubject => {
                if (teacherSubject.teacherId == teacherId) {
                    return teacherSubject;
                }
            });
            const targetSubjectsId = targetSubjects.map(targetSubject => targetSubject.subjectId);
            const filteredCurrentSubjects = subjects.filter(sbjct => targetSubjectsId.includes(sbjct.id));
            setCurrentSubjects(filteredCurrentSubjects);

            if (currentSubjects && currentSubjects[0]) {
                setSubjectId(currentSubjects[0].id);
            }
        }
    }, [teacherId, teacherSubjects, subjects]);

    useEffect(() => {
        if (currentSubjects && currentSubjects[0]) {
            setSubjectId(currentSubjects[0].id);
        }
    }, [currentSubjects]);

    useEffect(() => isEmpty(), [date, time, theme]);

    const isEmpty = () => {
        if (!date || !time || !theme.trim() || !groups.length || !teachers.length || !currentSubjects.length) {
            return setCreateEnabled(true);
        }

        return setCreateEnabled(false);
    }

    const createLessonHandler = () => {
        const targetDate = date + " " + time;
        const lesson = { groupId, teacherId, subjectId, date: targetDate, theme, homework };

        const error = lessons.some(lssn => 
            lssn.groupId == groupId && 
            lssn.teacherId == teacherId && 
            lssn.subjectId == subjectId &&
            lssn.date == targetDate
        );
 
        if (error) {
            clearInputs();
            return setOpenErrorModal(true);
        }

        return createScheduleRequest(lesson)
            .then(() => {
                clearInputs();
                getScheduleRequest()
                    .then(lssns => setLessons(lssns));
            })
            .catch(e => console.log(e));        
    }

    const deleteLessonHandler = () => {
        const scheduleId = selectedLesson.id;

        return deleteScheduleRequest(scheduleId)
            .then(() => {
                setSelectedLesson(null);
                getScheduleRequest()
                    .then(lssns => setLessons(lssns));
            })
    }

    const clearInputs = () => {
        setDate("");
        setTime("");
        setTheme("");
        setHomework("");
    }

    return (
        <Layout>
            {
                openEditModal ? <ScheduleModal setOpenEditModal={setOpenEditModal} 
                                               lesson={selectedLesson}
                                               setLessons={setLessons}
                                               setSelectedLesson={setSelectedLesson}
                                /> : null 
            }
            { 
                openErrorModal ? <ErrorModal errorText="Занятие уже существует!"
                                             setOpenErrorModal={setOpenErrorModal}
                                /> : null 
            }
            <div className="schedule_component">
                <div className="left_side">
                    <h1>Расписание</h1>
                    <div className="schedule">
                        <div className="fields">
                            <div className="field_date">Дата</div>
                            <div className="field_group">Группа</div>
                            <div className="field_teacher">Преподаватель</div>
                            <div className="field_subject">Предмет</div>
                            <div className="field_theme">Тема</div>
                        </div>
                        <div className="list">
                            { 
                                lessons.map(lesson => 
                                    <Lesson lesson={lesson}
                                          selectedLesson={selectedLesson}
                                          setSelectedLesson={setSelectedLesson}
                                          key={lesson.id}
                                    />)
                            }
                        </div>
                    </div>
                    <div className="buttons">
                        <Link to={`/main/schedule/${lessonId}`}>
                            <button onClick={() => localStorage.setItem("lessonId", lessonId)} 
                                    disabled={selectedLesson === null ? true : false} 
                                    className="marks"
                            >
                                Оценки
                            </button>
                        </Link>
                        <Link to={`/main/schedule/${lessonId}/homework`}>
                            <button onClick={() => localStorage.setItem("lessonId", lessonId)} 
                                    disabled={selectedLesson === null ? true : false} 
                                    className="homework"
                            >
                                Домашние работы
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="right_side">
                    <h1>Добавить занятие</h1>
                    <select className="selector" onChange={e => setGroupId(e.target.value)}>
                        {
                            groups.length ?
                                groups.map(group => 
                                    <option value={group.id}
                                            key={group.id}
                                    >
                                        { group.name }
                                    </option>)
                            : <option>Нет доступных групп</option>
                        }
                    </select>
                    <select className="selector" onChange={e => setTeacherId(e.target.value)}>
                        {
                            teachers.length ?
                                teachers.map(teacher => 
                                    <option value={teacher.id}
                                            key={teacher.id}
                                    >
                                        { teacher.fullName }
                                    </option>)
                            : <option>Нет доступных преподавателей</option>
                        }
                    </select>
                    <select className="selector" onChange={e => setSubjectId(e.target.value)}>
                        {
                            currentSubjects.length ?
                                currentSubjects.map(subject => 
                                    <option value={subject.id}
                                            key={subject.id}
                                    >
                                        { subject.name }
                                    </option>)
                            : <option>Нет доступных предметов</option>
                        }
                    </select>
                    <input onChange={e => setDate(e.target.value)} 
                        value={date}
                        className="date" 
                        placeholder="Дата (DD.MM.YYYY)"
                        type="date"
                    />
                    <input onChange={e => setTime(e.target.value)} 
                        value={time}
                        className="time" 
                        placeholder="Время (HH:MM)"
                        type="time"
                    />
                    <input onChange={e => setTheme(e.target.value)} 
                        value={theme}
                        className="theme" 
                        placeholder="Тема"
                    />
                    <input onChange={e => setHomework(e.target.value)} 
                        value={homework}
                        className="homeworks" 
                        placeholder="Домашнее задание"
                    />
                    <button onClick={createLessonHandler} 
                            disabled={createEnabled} 
                            className="add_lesson"
                    >
                        Добавить занятие
                    </button>
                    <button onClick={() => setOpenEditModal(true)} 
                            disabled={selectedLesson === null ? true : false} 
                            className="edit_lesson"
                    >
                        Редактировать занятие
                    </button>
                    <button onClick={deleteLessonHandler} 
                            disabled={selectedLesson === null ? true : false} 
                            className="remove_lesson"
                    >
                        Удалить занятие
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Schedule;