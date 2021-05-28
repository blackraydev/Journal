import React, { useEffect, useState } from 'react'
import { getUsersRequest } from '../services/usersServices';
import "../styles/Mark.css";

const Mark = ({ mark, selectedMark, setSelectedMark }) => {
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState({});

    useEffect(() => {
        getUsersRequest().then(users => setStudents(users.filter(user => user.role == "Студент")));
    }, []);

    useEffect(() => {
        if (students) {
            const targetStudent = students.find(stdnt => stdnt.id == mark.studentId);
            setStudent(targetStudent);
        }
    }, [students]);

    const markClickHandler = () => {
        if (selectedMark === mark) {
            setSelectedMark(null);
        } 
        else {
            setSelectedMark(mark);
        }
    }

    return (
        <div onClick={markClickHandler} 
             className={mark === selectedMark ? "mark active" : "mark"}
        >
            <div className="existing_student">{ student && student.fullName }</div>
            <div className="existing_mark">{ mark.mark }</div>
        </div>
    )
}

export default Mark
