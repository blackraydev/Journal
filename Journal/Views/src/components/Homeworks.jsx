import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { getScheduleRequest } from '../services/scheduleServices';
import { getGroupsRequest } from '../services/groupsServices';
import { getSubjectsRequest } from '../services/subjectsServices';
import { getUsersRequest } from '../services/usersServices';
import { getHomeworksRequest, saveHomeworkRequest } from '../services/homeworksServices';
import "../styles/Homeworks.css";
import Homework from './Homework';
import { useHistory } from 'react-router';

const Homeworks = () => {
    const [lessons, setLessons] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [homeworks, setHomeworks] = useState([]);
    const [targetHomeworks, setTargetHomeworks] = useState([]);

    const lessonId = localStorage.getItem("lessonId");
    const [note, setNote] = useState("");
    const [group, setGroup] = useState({});
    const [teacher, setTeacher] = useState({});
    const [subject, setSubject] = useState({});
    const [lesson, setLesson] = useState({});
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [saveEnabled, setSaveEnabled] = useState(false);
    const [areaEnabled, setAreaEnabled] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getHomeworksRequest().then(hmwrks => setHomeworks(hmwrks));
        getScheduleRequest().then(lssns => setLessons(lssns));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getUsersRequest().then(usrs => {
            const filteredTeachers = usrs.filter(usr => usr.role == "Преподаватель");
            setTeachers(filteredTeachers);
        });
    }, []);

    useEffect(() => {
        const filteredHomeworks = homeworks.filter(homework => homework.lessonId == lessonId);
        setTargetHomeworks(filteredHomeworks);
    }, [homeworks]);

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
        if (selectedHomework) {
            setAreaEnabled(false);
            setSaveEnabled(false);
            return setNote(selectedHomework.note);
        }

        setAreaEnabled(true);
        setSaveEnabled(true);
        return setNote("");
    }, [selectedHomework]);

    const saveNoteHandler = () => {
        const newHomework = { ...selectedHomework, note };

        return saveHomeworkRequest(newHomework)
            .then(() => {
                setSelectedHomework(null);
                getHomeworksRequest().then(hmwrks => setHomeworks(hmwrks));
            })
    }

    const goToMarks = () => history.push(`/main/schedule/${lessonId}`);

    return (
        <Layout>
            <div className="homework_component">
                <div className="left_side">
                    <h1>
                        {
                            `${group && group.name} - 
                             ${teacher && teacher.fullName} - 
                             ${subject && subject.name} - 
                             ${lesson && lesson.date && lesson.date.substr(0, 10)}`
                        }
                    </h1>
                    <div className="homeworks">
                        <div className="fields">
                            <div className="field_student">Студент</div>
                            <div className="field_date">Дата</div>
                        </div>
                        <div className="list">
                            {
                                targetHomeworks.map(homework => 
                                    <Homework homework={homework}
                                              selectedHomework={selectedHomework}
                                              setSelectedHomework={setSelectedHomework}
                                              key={homework.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="middle_side">
                    <h1>Решение</h1>
                    <textarea className="solution" 
                              value={ selectedHomework ? selectedHomework.solution : "" }
                              disabled 
                    />
                </div>
                <div className="right_side">
                    <h1>Примечание</h1>
                    <textarea onChange={e => setNote(e.target.value)} 
                        value={note}
                        className="note" 
                        placeholder="Примечание"
                        disabled={areaEnabled}
                    />
                    <button onClick={saveNoteHandler} 
                            className="save_note"
                            disabled={saveEnabled}
                    >
                        Сохранить примечание
                    </button>
                    <button onClick={goToMarks} 
                            className="go_to_marks"
                    >
                        Оценки
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Homeworks;