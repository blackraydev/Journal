import React from 'react'
import "../styles/Me.css";

const Me = () => {
    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("role");

    return (
        <div className="me_component">
            <h5>{ role } - { fullName }</h5>
        </div>
    )
}

export default Me;