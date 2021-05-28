import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import TeacherLesson from "./TeacherLesson"
import { getGroupsRequest } from "../../services/groupsServices";
import { getUsersRequest } from "../../services/usersServices";
import { getSubjectsRequest } from "../../services/subjectsServices";
import { getTeacherSubjectsRequest } from "../../services/teacherSubjectsServices";
import { createScheduleRequest, deleteScheduleRequest, editScheduleRequest, getScheduleRequest } from '../../services/scheduleServices';
import "../../styles/TeacherSchedule.css";
import ScheduleModal from '../ScheduleModal';
import ErrorModal from '../ErrorModal';
import { Link } from 'react-router-dom';

const TeacherSchedule = () => {
    const teacherId = localStorage.getItem("teacherId");
    const [lessonId, setLessonId] = useState(0);
    const [lessons, setLessons] = useState([]);
    const [teacherLessons, setTeacherLessons] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [currentSubjects, setCurrentSubjects] = useState([]);
    const [groupId, setGroupId] = useState(1);
    const [subjectId, setSubjectId] = useState(1);
    const [homework, setHomework] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [areaEnabled, setAreaEnabled] = useState(false);
    const [saveEnabled, setSaveEnabled] = useState(false);

    useEffect(() => {
        getScheduleRequest().then(schdl => setLessons(schdl));
        getTeacherSubjectsRequest().then(tchrSbjcts => setTeacherSubjects(tchrSbjcts));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
    }, []);

    useEffect(() => {
        if (lessons) {
            const filteredLessons = lessons.filter(lssn => lssn.teacherId == teacherId);
            setTeacherLessons(filteredLessons);
        }
    }, [lessons]);

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

    useEffect(() => {
        if (selectedLesson) {
            setAreaEnabled(false);
            setSaveEnabled(false);
            return setHomework(selectedLesson.homework);
        }

        setAreaEnabled(true);
        setSaveEnabled(true);
        return setHomework("");
    }, [selectedLesson]);

    const saveHomeworkHandler = () => {
        const newLesson = { ...selectedLesson, homework };

        return editScheduleRequest(newLesson)
            .then(() => {
                setSelectedLesson(null);
                getScheduleRequest().then(lssns => setLessons(lssns));
            })
    }

    return (
        <Layout>
            <div className="teacher_schedule_component">
                <div className="left_side">
                    <h1>Расписание</h1>
                    <div className="teacher_schedule">
                        <div className="fields">
                            <div className="field_group">Группа</div>
                            <div className="field_subject">Предмет</div>
                            <div className="field_date">Дата</div>
                            <div className="field_theme">Тема</div>
                        </div>
                        <div className="list">
                            { 
                                teacherLessons.map(lesson => 
                                    <TeacherLesson lesson={lesson}
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
                    <h1>Домашняя работа</h1>
                    <textarea onChange={e => setHomework(e.target.value)} 
                        value={homework}
                        className="homework" 
                        placeholder="Домашняя работа"
                        disabled={areaEnabled}
                    />
                    <button onClick={saveHomeworkHandler} 
                            className="save_homework"
                            disabled={saveEnabled}
                    >
                        Сохранить домашнюю работу
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default TeacherSchedule;