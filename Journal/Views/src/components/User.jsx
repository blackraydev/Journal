import React from 'react'
import "../styles/User.css";

const User = ({ user, selectedUser, setSelectedUser }) => {
    const userClickHandler = () => {
        if (selectedUser === user) {
            setSelectedUser(null);
        } 
        else {
            setSelectedUser(user);
        }
    }

    return (
        <div onClick={userClickHandler} 
             className={user === selectedUser ? "user active" : "user"}
        >
            <div className="existing_role">{ user.role }</div>
            <div className="existing_fio">{ user.fullName }</div>
            <div className="existing_birth_date">{ user.birthDate }</div>
            <div className="existing_login">{ user.login }</div>
            <div className="existing_password">{ user.password }</div>
        </div>
    )
}

export default User;