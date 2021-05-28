import React, { useEffect, useState } from 'react';
import { getGroupsRequest } from '../../services/groupsServices';
import { getSubjectsRequest } from '../../services/subjectsServices';
import { getUsersRequest } from '../../services/usersServices';
import "../../styles/TeacherLesson.css";

const Group = ({ lesson, selectedLesson, setSelectedLesson }) => {
    const [group, setGroup] = useState({});
    const [teacher, setTeacher] = useState({});
    const [subject, setSubject] = useState({});
    const [date, setDate] = useState(lesson.date);
    const [dateString, setDateString] = useState("");
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        getGroupsRequest().then(groups => setGroup(groups.find(grp => grp.id == lesson.groupId)));
        getUsersRequest().then(users => setTeacher(users.find(usr => usr.id == lesson.teacherId)));
        getSubjectsRequest().then(subjects => setSubject(subjects.find(sbjct => sbjct.id == lesson.subjectId)));
    }, []);

    useEffect(() => {
        if (date.length > 16) {
            const dateStringTemp = date.substr(0, date.length - 3);

            if (date.includes("-")) {
                const year = date.substr(0, 4);
                const month = date.substr(5, 2);
                const day = date.substr(8, 2);
                const time = date.substr(11, 5);
    
                return setDateString(`${day}.${month}.${year} ${time}`);
            }
            
            setDateString(dateStringTemp);
        }
        else {
            if (date.includes("-")) {
                const year = date.substr(0, 4);
                const month = date.substr(5, 2);
                const day = date.substr(8, 2);
                const time = date.substr(11, 5);
    
                return setDateString(`${day}.${month}.${year} ${time}`);
            }
            
            setDateString(date);
        }
    }, [date]);

    const lessonClickHandler = () => {
        if (selectedLesson === lesson) {
            setSelectedLesson(null);
        } 
        else {
            setSelectedLesson(lesson);
        }
    }

    if (shouldRender) {
        return (
            <div onClick={lessonClickHandler} 
                 className={lesson === selectedLesson ? "teacher_lesson active" : "teacher_lesson"}
            >
                <div className="existing_group">{ group.name }</div>
                <div className="existing_subject">{ subject.name }</div>
                <div className="existing_date">{ dateString }</div>
                <div className="existing_theme">{ lesson.theme }</div>
            </div>
        )
    }
    
    return null;
}

export default Group;