import React, { useEffect, useState } from 'react';
import { getGroupsRequest } from '../services/groupsServices';
import { getSubjectsRequest } from '../services/subjectsServices';
import { getUsersRequest } from '../services/usersServices';
import "../styles/Lesson.css";

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

    useEffect(() => {
        const withoutTime = dateString.substr(0, 10);

        if (withoutTime) {
            const day = withoutTime.substr(0, 2);
            const month = Number(withoutTime.substr(3, 2)) - 1;
            const year = withoutTime.substr(6, 4);

            const today = new Date();
            const subjectDate = new Date();
    
            subjectDate.setFullYear(year);
            subjectDate.setMonth(month);
            subjectDate.setDate(day);
            subjectDate.setHours(0, 0, 0);
            
            if ((subjectDate.getMonth() == today.getMonth() && subjectDate.getDate() - today.getDate() < 0) || (subjectDate.getMonth() < today.getMonth())) {
                setShouldRender(false);
            }
        }
        
    }, [dateString]);

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
                 className={lesson === selectedLesson ? "lesson active" : "lesson"}
            >
                <div className="existing_group">{ group.name }</div>
                <div className="existing_teacher">{ teacher.fullName }</div>
                <div className="existing_subject">{ subject.name }</div>
                <div className="existing_date">{ dateString }</div>
                <div className="existing_theme">{ lesson.theme }</div>
            </div>
        )
    }
    
    return null;
}

export default Group;