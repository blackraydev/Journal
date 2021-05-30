import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const CustomLink = ({ link, text, tabName, setTabName, logout }) => {
    const index = link.lastIndexOf("/");
    const activeTabName = link.substr(index);

    const actionHandler = () => {
        if (logout) {
            localStorage.removeItem("role");
            localStorage.removeItem("lessonId");
            localStorage.removeItem("teacherId");
            localStorage.removeItem("studentId");
        }

        setTabName(link);
    }

    return(
        <Link onClick={actionHandler} to={link}>
            <div className={tabName == link || tabName == activeTabName ? "link active" : "link"}>
                {text}
            </div>
        </Link>
    )
}

const Navbar = () => {
    const role = localStorage.getItem("role");
    const href = window.location.href;
    const index = href.lastIndexOf("/");
    const [tabName, setTabName] = useState(href.substr(index));

    const renderAdminPart = () => {
        return(
            <>
                <CustomLink link="/main" text="Предметы" tabName={tabName} setTabName={setTabName} />
                <CustomLink link="/main/groups" text="Группы" tabName={tabName} setTabName={setTabName} />
                <CustomLink link="/main/users" text="Пользователи" tabName={tabName} setTabName={setTabName} />
                <CustomLink link="/main/schedule" text="Расписание" tabName={tabName} setTabName={setTabName} />
                <CustomLink link="/main/reports" text="Отчеты" tabName={tabName} setTabName={setTabName} />
                <CustomLink link="/main/teacherSubjects" text="Преподаватели" tabName={tabName} setTabName={setTabName} />
            </>
        )
    }

    const renderTeacherPart = () => {
        return(
            <>
                <CustomLink link="/teacher" text="Расписание" tabName={tabName} setTabName={setTabName} />
            </>
        )
    }

    const renderStudentPart = () => {
        return(
            <>
                <CustomLink link="/student" text="Дневник" tabName={tabName} setTabName={setTabName} />
            </>
        )
    }

    return(
        <div className="navbar">
            <div className="left_part">
                { role == "Зав. кафедрой" ? renderAdminPart() : null }
                { role == "Преподаватель" ? renderTeacherPart() : null }
                { role == "Студент" ? renderStudentPart() : null }
            </div>
            <div className="right_part">
                <CustomLink link="/" text="Выход" tabName={tabName} setTabName={setTabName} logout/>
            </div>
        </div>
    )
}

export default Navbar;