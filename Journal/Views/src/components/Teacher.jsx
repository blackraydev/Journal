import React from 'react';
import "../styles/Teacher.css";

const Teacher = ({ teacher, selectedTeacher, setSelectedTeacher }) => {
    const teacherClickHandler = () => {
        if (selectedTeacher === teacher) {
            setSelectedTeacher(null);
        } 
        else {
            setSelectedTeacher(teacher);
        }
    }

    return (
        <div onClick={teacherClickHandler} 
             className={teacher === selectedTeacher ? "teacher active" : "teacher"}
        >
            <div className="existing_teacher">{ teacher.fullName }</div>
        </div>
    )
}

export default Teacher;