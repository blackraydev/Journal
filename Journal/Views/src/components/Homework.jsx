import React, { useEffect, useState } from 'react';
import { getUsersRequest } from '../services/usersServices';
import "../styles/Homework.css";

const Homework = ({ homework, selectedHomework, setSelectedHomework }) => {
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState(null);
    const [dateString, setDateString] = useState("");
    
    useEffect(() => {
        let date = homework.date;

        date = date.split("T");
        date = date.join(" ");
        date = date.substr(0, 16);

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
    }, [homework]);

    useEffect(() => {
        getUsersRequest().then(users => setStudents(users.filter(user => user.role == "Студент")));
    }, []);

    useEffect(() => {
        if (students) {
            const targetStudent = students.find(stdnt => stdnt.id == homework.studentId);
            setStudent(targetStudent);
        }
    }, [students]);
    
    const homeworkClickHandler = () => {
        if (selectedHomework === homework) {
            setSelectedHomework(null);
        } 
        else {
            setSelectedHomework(homework);
        }
    }

    return (
        <div onClick={homeworkClickHandler} 
             className={homework === selectedHomework ? "homework active" : "homework"}
        >
            <div className="existing_student">{ student && student.fullName }</div>
            <div className="existing_date">{ dateString }</div>
        </div>
    )
}

export default Homework;