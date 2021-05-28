import React, { useEffect, useState } from 'react';
import { editUserRequest, getUsersRequest } from '../services/usersServices';
import "../styles/UsersModal.css";

const UsersModal = ({ setOpenEditModal, user, setUsers, setSelectedUser }) => {
    const [role, setRole] = useState(user.role);
    const [fullName, setFullName] = useState(user.fullName);
    const [birthDate, setBirthDate] = useState(user.birthDate);
    const [login, setLogin] = useState(user.login);
    const [password, setPassword] = useState(user.password);
    const [selectedRoleId, setSelectedRoleId] = useState(0);
    const [editEnabled, setEditEnabled] = useState(false);

    useEffect(() => isEmpty(), [role, fullName, birthDate, login, password]);

    const isEmpty = () => {
        if (!role.trim() || !fullName.trim() || !birthDate.trim() || !login.trim() || !password.trim()) {
            return setEditEnabled(true);
        }

        return setEditEnabled(false);
    }

    useEffect(() => {
        if (role == "Зав. кафедрой") setSelectedRoleId(0);
        if (role == "Преподаватель") setSelectedRoleId(1);
        if (role == "Студент") setSelectedRoleId(2);
    }, []);

    useEffect(() => {
        const roles = ["Зав. кафедрой", "Преподаватель", "Студент"];
        setRole(roles[selectedRoleId]);
    }, [selectedRoleId]);

    const editUserHandler = () => {
        const editedUser = { ...user, role, fullName, birthDate, login, password};

        return editUserRequest(editedUser)
            .then(() => {
                getUsersRequest()
                    .then(usrs => {
                        setUsers(usrs);
                        setOpenEditModal(false);
                        setSelectedUser(null);
                    });
            })
            .catch(e => console.log(e))
    }

    return(
        <div className="modal_users">
            <div className="window">
                <div className="inputs">
                    <div className="input_holder">
                        <label>Роль</label>
                        <select className="selector" onChange={e => setSelectedRoleId(e.target.value)}>
                            <option value={0} selected={selectedRoleId == 0}> Зав. кафедрой </option>
                            <option value={1} selected={selectedRoleId == 1}> Преподаватель </option>
                            <option value={2} selected={selectedRoleId == 2}> Студент </option>
                        </select>
                    </div>
                    <div className="input_holder">
                        <label>ФИО</label>
                        <input value={fullName} 
                            onChange={e => setFullName(e.target.value)} 
                            placeholder="ФИО" 
                        />
                    </div>
                    <div className="input_holder">
                        <label>Дата рождения</label>
                        <input value={birthDate} 
                            onChange={e => setBirthDate(e.target.value)} 
                            placeholder="Дата рождения" 
                        />
                    </div>
                    <div className="input_holder">
                        <label>Логин</label>
                        <input value={login} 
                            onChange={e => setLogin(e.target.value)} 
                            placeholder="Логин" 
                        />
                    </div>
                    <div className="input_holder">
                        <label>Пароль</label>
                        <input value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Пароль" 
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={editUserHandler} 
                            className="edit_user" 
                            disabled={editEnabled}
                    >
                        Редактировать пользователя
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

export default UsersModal;