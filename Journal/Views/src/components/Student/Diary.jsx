import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import Lesson from "../Lesson";
import { getGroupsRequest } from "../../services/groupsServices";
import { getUsersRequest } from "../../services/usersServices";
import { getSubjectsRequest } from "../../services/subjectsServices";
import { getTeacherSubjectsRequest } from "../../services/teacherSubjectsServices";
import { getAllStudentsRequest } from "../../services/studentsServices";
import { createScheduleRequest, deleteScheduleRequest, getScheduleRequest } from '../../services/scheduleServices';
import "../../styles/Diary.css";
import { createHomeworkRequest, getHomeworksRequest, saveHomeworkRequest } from '../../services/homeworksServices';
import StudentLesson from './StudentLesson';

const Diary = () => {
    const studentId = localStorage.getItem("studentId");
    const [lessonId, setLessonId] = useState(0);
    const [lessons, setLessons] = useState([]);
    const [targetLessons, setTargetLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [currentSubjects, setCurrentSubjects] = useState([]);
    const [homeworks, setHomeworks] = useState([]);
    const [groupId, setGroupId] = useState(1);
    const [teacherId, setTeacherId] = useState(1);
    const [subjectId, setSubjectId] = useState(1);
    const [homework, setHomework] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [solution, setSolution] = useState("");
    const [note, setNote] = useState("");
    const [areaEnabled, setAreaEnabled] = useState(false);
    const [saveEnabled, setSaveEnabled] = useState(false);

    useEffect(() => {
        getScheduleRequest().then(schdl => setLessons(schdl));
        getTeacherSubjectsRequest().then(tchrSbjcts => setTeacherSubjects(tchrSbjcts));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getHomeworksRequest().then(hmwrks => setHomeworks(hmwrks));
        getAllStudentsRequest().then(stdnts => setStudents(stdnts));
        getUsersRequest().then(usrs => {
            const filteredTeachers = usrs.filter(usr => usr.role == "Преподаватель");
            setTeachers(filteredTeachers);
        });
    }, []);

    useEffect(() => {
        if (lessons.length && students.length) {
            const studentToGroup = students.find(stdnt => stdnt.studentId == studentId);
            const filteredLessons = lessons.filter(lssn => lssn.groupId == studentToGroup.groupId);
            setTargetLessons(filteredLessons);
        }
    }, [lessons, students]);

    useEffect(() => {
        if (homeworks && selectedLesson) {
            const targetHomework = homeworks.find(hmwrk => hmwrk.lessonId == selectedLesson.id);
            setHomework(targetHomework);
            setNote(targetHomework && targetHomework.note || "");
            setSolution(targetHomework && targetHomework.solution || "")
        }
    }, [selectedLesson]);

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

    useEffect(() => {
        if (selectedLesson) {
            setAreaEnabled(false);
            setSaveEnabled(false);
            return;
        }

        setAreaEnabled(true);
        setSaveEnabled(true);
        setNote("");
        setSolution("");
    }, [selectedLesson]);

    const saveSolutionHandler = () => {
        let newHomework;

        if (homework) {
            newHomework = { ...homework, solution };

            return saveHomeworkRequest(newHomework)
                .then(() => {
                    setHomework(null);
                    setSelectedLesson(null);
                    getHomeworksRequest().then(hmwrks => setHomeworks(hmwrks));
                })
        }

        newHomework = {
            studentId, lessonId, date: new Date(), solution, note: ""
        }

        return createHomeworkRequest(newHomework)
            .then(() => {
                setHomework(null);
                setSelectedLesson(null);
                getHomeworksRequest().then(hmwrks => setHomeworks(hmwrks));
            })
    }

    const sortByDate = (a, b) => {
        return transformDate(a) - transformDate(b);
    }

    const transformDate = (targetDate) => {
        const date = targetDate.date.substr(0, 10);
        const time = targetDate.date.substr(11, 5);
        const timeArr = time.split(":");
        const reverseDate = date.split(".").reverse().join("-");
        const reverseTimeDate = new Date(reverseDate).setHours(timeArr[0], timeArr[1]);

        return reverseTimeDate;
    }

    return (
        <Layout>
            <div className="diary_component">
                <div className="left_side">
                    <div className="lessons">
                        <div className="fields">
                            <div className="field_date">Дата</div>
                            <div className="field_subject">Предмет</div>
                            <div className="field_teacher">Преподаватель</div>
                            <div className="field_theme">Тема</div>
                            <div className="field_mark">Оценка</div>
                        </div>
                        <div className="list">
                            { 
                                targetLessons.sort(sortByDate)
                                             .map(lesson => 
                                    <StudentLesson lesson={lesson}
                                                   selectedLesson={selectedLesson}
                                                   setSelectedLesson={setSelectedLesson}
                                                   key={lesson.id}
                                    />)
                            }
                        </div>
                    </div>
                    <h1>Примечание</h1>
                    <textarea className="note" 
                              value={ note }
                              disabled 
                    />
                </div>
                <div className="right_side">
                    <h1>Решение</h1>
                    <textarea onChange={e => setSolution(e.target.value)} 
                        value={solution}
                        className="solution" 
                        placeholder="Решение"
                        disabled={areaEnabled}
                    />
                    <button onClick={saveSolutionHandler} 
                            className="save_solution"
                            disabled={saveEnabled}
                    >
                        Сохранить решение
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Diary
