import React from 'react'
import "../styles/Student.css";

const Student = ({ student, selectedStudent, setSelectedStudent }) => {
    const studentClickHandler = () => {
        if (selectedStudent === student) {
            setSelectedStudent(null);
        } 
        else {
            setSelectedStudent(student);
        }
    }

    return (
        <div onClick={studentClickHandler} 
             className={student === selectedStudent ? "student active" : "student"}
        >
            <div className="existing_student">{ student.fullName }</div>
        </div>
    )
}

export default Student;