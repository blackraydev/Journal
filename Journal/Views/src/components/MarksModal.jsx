import React, { useEffect, useState } from 'react'
import { editMarkRequest, getMarksRequest } from '../services/marksServices';
import { getUsersRequest } from '../services/usersServices';
import "../styles/MarksModal.css";

const MarksModal = ({ setOpenEditModal, mark, setMarks, setSelectedMark }) => {
    const [users, setUsers] = useState([]);
    const [student, setStudent] = useState({});
    const [studentMark, setStudentMark] = useState();

    useEffect(() => {
        getUsersRequest().then(usrs => setUsers(usrs));
    }, []);

    useEffect(() => {
        const targetStudent = users.find(user => user.id == mark.studentId);
        setStudent(targetStudent);
    }, [users]);

    const editMarkHandler = () => {
        const editedMark = { ...mark, mark: studentMark };

        return editMarkRequest(editedMark)
            .then(() => {
                getMarksRequest()
                    .then(marks => {
                        setMarks(marks);
                        setOpenEditModal(false);
                        setSelectedMark(null);
                    });
            })
            .catch(e => console.log(e))
    }

    return (
        <div className="modal_marks">
            <div className="window">
                <div className="inputs">
                    <div className="input_holder">
                        <label>Студент</label>
                        <input value={student && student.fullName} disabled/>
                    </div>
                    <div className="input_holder">
                        <label>Оценка</label>
                        <select className="selector" onChange={e => setStudentMark(e.target.value)}>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "Не явка", "Болен"].map((elem, index) => 
                                    <option value={ elem } 
                                            selected={index + 1 == mark.mark}
                                            key={index}
                                    >
                                        { elem }
                                    </option>
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={editMarkHandler} 
                            className="edit_mark" 
                    >
                        Редактировать оценку
                    </button>
                    <button onClick={() => setOpenEditModal(false)} 
                            className="cancel"
                    >
                        Отменить
                    </button>
                </div>
            </div>
            <div className="overlay"/>
        </div>
    )
}

export default MarksModal
