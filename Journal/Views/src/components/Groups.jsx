import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import Group from "./Group";
import { getGroupsRequest, createGroupRequest, deleteGroupRequest } from "../services/groupsServices";
import { getUsersRequest } from "../services/usersServices";
import GroupsModal from "./GroupsModal";
import ErrorModal from "./ErrorModal";
import "../styles/Groups.css";
import Student from "./Student";
import { getStudentsRequest, getAvailableStudentsRequest, addStudentToGroupRequest, removeStudentFromGroupRequest } from "../services/studentsServices";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [students, setStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(1);
    const [groupName, setGroupName] = useState("");
    const [createGroupEnabled, setCreateGroupEnabled] = useState(false);
    const [createStudentEnabled, setCreateStudentEnabled] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);

    useEffect(() => {
        getGroupsRequest()
            .then(grps => setGroups(grps));

        getUsersRequest()
            .then(usrs => setUsers(usrs));
    }, []);

    useEffect(() => isEmpty(), [groupName]);

    useEffect(() => {
        if (selectedGroup && availableStudents.length) {
            return setCreateStudentEnabled(false);
        }

        return setCreateStudentEnabled(true);
    }, [students, availableStudents]);

    useEffect(() => {
        if (selectedGroup) {
            const groupId = selectedGroup.id;
            getStudentsRequest(groupId)
                .then(studentsId => {
                    const currentStudents = users.filter(user => studentsId.includes(user.id));
                    setStudents(currentStudents);
                });
        }
        else {
            setStudents([]);
        }
    }, [selectedGroup]);

    useEffect(() => {
        getAvailableStudentsRequest()
            .then(avStudents => {
                setAvailableStudents(avStudents);

                if (avStudents && avStudents[0]) {
                    setSelectedStudentId(avStudents[0].id);
                }
            });
    }, [students]);

    useEffect(() => setSelectedStudent(null), [selectedGroup]);

    const isEmpty = () => {
        if (!groupName.trim()) {
            return setCreateGroupEnabled(true);
        }

        return setCreateGroupEnabled(false);
    }


    const createGroupHandler = () => {
        const group = { name: groupName };

        const error = groups.some(grp => grp.name === groupName);

        if (error) {
            setGroupName("");
            return setOpenErrorModal(true);
        }

        return createGroupRequest(group)
            .then(() => {
                setGroupName("");
                getGroupsRequest()
                    .then(grps => setGroups(grps));
            })
            .catch(e => console.log(e));
    }

    const deleteGroupHandler = () => {
        const groupId = selectedGroup.id;

        return deleteGroupRequest(groupId)
            .then(() => {
                setSelectedGroup(null);
                getGroupsRequest()
                    .then(grps => setGroups(grps));
            })
            .catch(e => { throw e });
    }

    const addStudentToGroupHandler = () => {
        const student = { studentId: selectedStudentId, groupId: selectedGroup.id };

        return addStudentToGroupRequest(student)
            .then(() => {
                const groupId = selectedGroup.id;
                getStudentsRequest(groupId)
                    .then(studentsId => {
                        const currentStudents = users.filter(user => studentsId.includes(user.id));
                        setStudents(currentStudents);
                    });
            })
    }

    const removeStudentFromGroupHandler = () => {
        const student = { studentId: selectedStudent.id, groupId: selectedGroup.id };

        return removeStudentFromGroupRequest(student)
            .then(() => {
                const groupId = selectedGroup.id;
                getStudentsRequest(groupId)
                    .then(studentsId => {
                        const currentStudents = users.filter(user => studentsId.includes(user.id));
                        setStudents(currentStudents);
                    });
                setSelectedStudent(null);
            })
    }

    return (
        <Layout>
            {
                openEditModal ? <GroupsModal setOpenEditModal={setOpenEditModal} 
                                             group={selectedGroup}
                                             setGroups={setGroups}
                                             setSelectedGroup={setSelectedGroup}
                                /> : null 
            }
            { 
                openErrorModal ? <ErrorModal errorText="Группа с таким названием уже существует!"
                                             setOpenErrorModal={setOpenErrorModal}
                                /> : null 
            }
            <div className="groups_component">
                <div className="left_side">
                    <h1>Группы</h1>
                    <div className="groups">
                        <div className="fields">
                            <div className="field_group_name">Название группы</div>
                        </div>
                        <div className="list">
                            {
                                groups.sort((a, b) => a.id - b.id)
                                      .map(group => 
                                    <Group group={group}
                                           selectedGroup={selectedGroup}
                                           setSelectedGroup={setSelectedGroup}
                                           key={group.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="middle_side">
                    <h1>Студенты</h1>
                    <div className="students">
                        <div className="fields">
                            <div className="field_student">Студент</div>
                        </div>
                        <div className="list">
                            {
                                students.map(student => 
                                    <Student student={student}
                                             selectedStudent={selectedStudent}
                                             setSelectedStudent={setSelectedStudent}
                                             key={student.id}
                                    />)
                            }
                        </div>
                    </div>
                </div>
                <div className="right_side">
                    <div className="top_part">
                        <h1>Добавить группу</h1>
                        <input onChange={e => setGroupName(e.target.value)} 
                            value={groupName}
                            className="groupName" 
                            placeholder="Название группы"
                        />
                        <button onClick={createGroupHandler} 
                                disabled={createGroupEnabled} 
                                className="add_group"
                        >
                            Добавить группу
                        </button>
                        <button onClick={() => setOpenEditModal(true)} 
                                disabled={selectedGroup === null ? true : false} 
                                className="edit_group"
                        >
                            Редактировать группу
                        </button>
                        <button onClick={deleteGroupHandler} 
                                disabled={selectedGroup === null ? true : false} 
                                className="remove_group"
                        >
                            Удалить группу
                        </button>
                    </div>
                    <div className="bottom_part">
                        <h1>Добавить студента</h1>
                        <select className="selector" onChange={e => setSelectedStudentId(e.target.value)}>
                            {
                                availableStudents.length ?
                                    availableStudents.map((availableStudent, index) => 
                                        <option value={availableStudent.id}
                                                key={availableStudent.id}
                                                selected={index == 0 ? true : false}
                                        >
                                            { availableStudent.fullName }
                                        </option>)
                                : <option>Нет доступных студентов</option>
                            }
                        </select>
                        <button onClick={addStudentToGroupHandler} 
                                disabled={createStudentEnabled} 
                                className="add_student"
                        >
                            Добавить студента
                        </button>
                        <button onClick={removeStudentFromGroupHandler} 
                                disabled={selectedStudent === null ? true : false} 
                                className="remove_student"
                        >
                            Удалить студента
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Groups;