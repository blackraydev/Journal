import React, { useEffect, useState } from 'react'
import { getGroupsRequest } from '../services/groupsServices';
import { getSubjectsRequest } from '../services/subjectsServices';
import { getUsersRequest } from '../services/usersServices';
import { getMarksRequest } from '../services/marksServices';
import "../styles/Report.css";

const Report = ({ studentId, groupId, subjectId }) => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [marks, setMarks] = useState([]);

    const [student, setStudent] = useState({});
    const [group, setGroup] = useState({});
    const [subject, setSubject] = useState({});
    const [mark, setMark] = useState("");

    useEffect(() => {
        getUsersRequest().then(usrs => setUsers(usrs));
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getMarksRequest().then(mrks => setMarks(mrks));
    }, []);

    useEffect(() => {
        if (users) {
            const targetStudent = users.find(user => user.id == studentId);
            setStudent(targetStudent);
        }
    }, [users]);

    useEffect(() => {
        if (groups) {
            const targetGroup = groups.find(group => group.id == groupId);
            setGroup(targetGroup);
        }
    }, [groups]);

    useEffect(() => {
        if (subjects) {
            const targetSubject = subjects.find(subject => subject.id == subjectId);
            setSubject(targetSubject);
        }
    }, [subjects]);

    useEffect(() => {
        if (marks) {
            const filteredMarks = marks.filter(mrk => mrk.studentId == studentId && mrk.subjectId == subjectId && mrk.mark != "Не явка" && mrk.mark != "Болен");
            const studentMarks = filteredMarks.map(mrk => mrk.mark);
            const markSum = studentMarks.reduce((sum, mark) => sum + mark, 0);

            if (studentMarks.length) {
                return setMark(markSum / studentMarks.length);
            }

            return setMark("");
        }
    }, [marks]);

    return (
        <tr className="report">
            <td className="existing_subject">{ subject && subject.name }</td>
            <td className="existing_group">{ group && group.name }</td>
            <td className="existing_student">{ student && student.fullName }</td>
            <td className="existing_mark">{ mark }</td>
        </tr>
    )
}

export default Report
