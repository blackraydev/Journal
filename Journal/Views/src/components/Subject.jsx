import React from 'react'
import "../styles/Subject.css";

const Subject = ({ subject, selectedSubject, setSelectedSubject }) => {
    const subjectClickHandler = () => {
        if (selectedSubject === subject) {
            setSelectedSubject(null);
        } 
        else {
            setSelectedSubject(subject);
        }
    }

    return (
        <div onClick={subjectClickHandler} 
             className={subject === selectedSubject ? "subject active" : "subject"}
        >
            <div className="existing_subject">{ subject.name }</div>
        </div>
    )
}

export default Subject