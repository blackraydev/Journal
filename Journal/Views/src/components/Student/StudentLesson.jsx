import React, { useEffect, useState } from 'react';
import { getGroupsRequest } from '../../services/groupsServices';
import { getHomeworksRequest } from '../../services/homeworksServices';
import { getSubjectsRequest } from '../../services/subjectsServices';
import { getUsersRequest } from '../../services/usersServices';
import { getMarksRequest } from "../../services/marksServices";
import "../../styles/StudentLesson.css";

const StudentLesson = ({ lesson, selectedLesson, setSelectedLesson }) => {
    const studentId = localStorage.getItem("studentId");
    const [group, setGroup] = useState({});
    const [teacher, setTeacher] = useState({});
    const [subject, setSubject] = useState({});
    const [date, setDate] = useState(lesson.date);
    const [dateString, setDateString] = useState("");
    const [mark, setMark] = useState("");

    useEffect(() => {
        getGroupsRequest().then(groups => setGroup(groups.find(grp => grp.id == lesson.groupId)));
        getUsersRequest().then(users => setTeacher(users.find(usr => usr.id == lesson.teacherId)));
        getSubjectsRequest().then(subjects => setSubject(subjects.find(sbjct => sbjct.id == lesson.subjectId)));
        getMarksRequest().then(marks => setMark(marks.find(mrk => mrk.lessonId == lesson.id && mrk.studentId == studentId)));
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

    return (
        <div onClick={lessonClickHandler} 
             className={lesson === selectedLesson ? "student_lesson active" : "student_lesson"}
        >
            <div className="existing_subject">{ subject.name }</div>
            <div className="existing_teacher">{ teacher.fullName }</div>
            <div className="existing_date">{ dateString }</div>
            <div className="existing_theme">{ lesson.theme }</div>
            <div className="existing_mark">{ mark && mark.mark }</div>
        </div>
    )
}

export default StudentLesson;