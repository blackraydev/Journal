import React, { useEffect, useState } from 'react'
import { getGroupsRequest } from '../services/groupsServices';
import { editScheduleRequest, getScheduleRequest } from '../services/scheduleServices';
import { getSubjectsRequest } from '../services/subjectsServices';
import { getTeacherSubjectsRequest } from '../services/teacherSubjectsServices';
import { getUsersRequest } from '../services/usersServices';
import "../styles/ScheduleModal.css";

const ScheduleModal = ({ setOpenEditModal, lesson, setLessons, setSelectedLesson }) => {
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [currentSubjects, setCurrentSubjects] = useState([]);
    const [groupId, setGroupId] = useState(lesson.groupId);
    const [teacherId, setTeacherId] = useState(lesson.teacherId);
    const [subjectId, setSubjectId] = useState(lesson.subjectId);
    const [date, setDate] = useState(lesson.date.substr(0, 10));
    const [time, setTime] = useState(lesson.date.substr(11, 5));
    const [theme, setTheme] = useState(lesson.theme || "");
    const [homework, setHomework] = useState(lesson.homework || "");
    const [editEnabled, setEditEnabled] = useState(true);

    useEffect(() => {
        getTeacherSubjectsRequest().then(tchrSbjcts => setTeacherSubjects(tchrSbjcts));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getUsersRequest().then(usrs => {
            const filteredTeachers = usrs.filter(usr => usr.role == "Преподаватель");
            setTeachers(filteredTeachers);
        });
    }, []);

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

    useEffect(() => isEmpty(), [date, time, theme, homework, groups, teachers, currentSubjects]);

    const isEmpty = () => {
        if (!date || !time || !theme.trim() || !homework.trim() || !groups.length || !teachers.length || !currentSubjects.length) {
            return setEditEnabled(true);
        }

        return setEditEnabled(false);
    }

    const editScheduleHandler = () => {
        const dateString = date + " " + time;
        const editedSchedule = { ...lesson, groupId, teacherId, subjectId, date: dateString, theme, homework };

        return editScheduleRequest(editedSchedule)
            .then(() => {
                getScheduleRequest().then(schdl => {
                    setLessons([]);
                    setLessons(schdl);
                    setOpenEditModal(false);
                    setSelectedLesson(null);
                });
            })
            .catch(e => console.log(e))
    }

    return (
        <div className="modal_schedule">
            <div className="window">
                <div className="inputs">
                    <div className="input_holder">
                        <label>Группа</label>
                        <select className="selector" onChange={e => setGroupId(e.target.value)}>
                            {
                                groups.length ?
                                    groups.map(group => 
                                        <option value={group.id}
                                                key={group.id}
                                                selected={groupId == group.id}
                                        >
                                            { group.name }
                                        </option>)
                                : <option>Нет доступных групп</option>
                            }
                        </select>
                    </div>
                    <div className="input_holder">
                        <label>Преподаватель</label>
                        <select className="selector" onChange={e => setTeacherId(e.target.value)}>
                            {
                                teachers.length ?
                                    teachers.map(teacher => 
                                        <option value={teacher.id}
                                                key={teacher.id}
                                                selected={teacherId == teacher.id}
                                        >
                                            { teacher.fullName }
                                        </option>)
                                : <option>Нет доступных преподавателей</option>
                            }
                        </select>
                    </div>
                    <div className="input_holder">
                        <label>Предмет</label>
                        <select className="selector" onChange={e => setSubjectId(e.target.value)}>
                            {
                                currentSubjects.length ?
                                    currentSubjects.map(subject => 
                                        <option value={subject.id}
                                                key={subject.id}
                                                selected={subjectId == subject.id}
                                        >
                                            { subject.name }
                                        </option>)
                                : <option>Нет доступных предметов</option>
                            }
                        </select>
                    </div>
                    <div className="input_holder">
                        <label>Дата</label>
                        <input value={date} 
                            onChange={e => setDate(e.target.value)} 
                            placeholder="Дата (DD.MM.YYYY)" 
                            type="date"
                        />
                    </div>
                    <div className="input_holder">
                        <label>Время</label>
                        <input value={time} 
                            onChange={e => setTime(e.target.value)} 
                            placeholder="Время (HH:MM)" 
                            type="time"
                        />
                    </div>
                    <div className="input_holder">
                        <label>Тема</label>
                        <input value={theme} 
                            onChange={e => setTheme(e.target.value)} 
                            placeholder="Тема" 
                        />
                    </div>
                    <div className="input_holder">
                        <label>Домашнее задание</label>
                        <input value={homework} 
                            onChange={e => setHomework(e.target.value)} 
                            placeholder="Домашнее задание" 
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={editScheduleHandler} 
                            className="edit_schedule" 
                            disabled={editEnabled}
                    >
                        Редактировать занятие
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

export default ScheduleModal
