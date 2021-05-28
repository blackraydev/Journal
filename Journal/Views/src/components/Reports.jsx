import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { getGroupsRequest } from "../services/groupsServices";
import { getSubjectsRequest } from "../services/subjectsServices";
import { getAllStudentsRequest } from "../services/studentsServices";
import "../styles/Reports.css";
import Report from './Report';

const Reports = () => {
    const [createEnabled, setCreateEnabled] = useState(false);
    const [groupId, setGroupId] = useState(0);
    const [subjectId, setSubjectId] = useState(0);

    const [groups, setGroups] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [targetStudents, setTargetStudents] = useState([]);

    useEffect(() => {
        getGroupsRequest().then(grps => setGroups(grps));
        getSubjectsRequest().then(sbjcts => setSubjects(sbjcts));
        getAllStudentsRequest().then(stdnts => setStudents(stdnts));
    }, []);

    useEffect(() => {
        if (groups && groups[0]) {
            setGroupId(groups[0].id);
        }
    }, [groups]);

    useEffect(() => {
        if (subjects && subjects[0]) {
            setSubjectId(subjects[0].id);
        }
    }, [subjects]);

    useEffect(() => {
        setTargetStudents([]);
    }, [subjectId])

    useEffect(() => {
        if (students && groupId && subjectId) {
            const filteredStudents = students.filter(stdnt => stdnt.groupId == groupId);
            setTargetStudents(filteredStudents);
        }
    }, [students, groupId]);

    useEffect(() => {
        if (!targetStudents.length) {
            const filteredStudents = students.filter(stdnt => stdnt.groupId == groupId);
            setTargetStudents(filteredStudents);
        }
    }, [targetStudents]);

    useEffect(() => {
        if (!groups.length || !subjects.length) {
            return setCreateEnabled(true);
        }

        return setCreateEnabled(false);
    }, [groups, subjects]);

    const triggerDownload = (url, filename) => {
        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    const exportToExcel = () => {
        const table = document.querySelector(".reports");
        const tableContent = table.outerHTML.replace(/ /g, "%20");
        const tableHTMLUrl = "data:application/vnd.ms-excel;charset=utf-8," + tableContent;
        
        triggerDownload(tableHTMLUrl, "performance.xls");
    }

    return (
        <Layout>
            <div className="reports_component">
                <div className="left_side">
                    <h1>Отчеты</h1>
                    <table className="reports">
                        <tr className="fields">
                            <th className="field_subject">Предмет</th>
                            <th className="field_group">Группа</th>
                            <th className="field_student">Студент</th>
                            <th className="field_mark">Итоговый балл</th>
                        </tr>
                        <tbody className="list">
                            { 
                                targetStudents.map(student => 
                                    <Report studentId={student.studentId}
                                            groupId={groupId}
                                            subjectId={subjectId}
                                            key={student.id}
                                    />)
                            }
                        </tbody>
                    </table>
                </div>
                <div className="right_side">
                    <h1>Выбор данных</h1>
                    <select className="selector" onChange={e => setGroupId(e.target.value)}>
                        {
                            groups.length ?
                                groups.map(group => 
                                    <option value={group.id}
                                            key={group.id}
                                    >
                                        { group.name }
                                    </option>)
                            : <option>Нет доступных групп</option>
                        }
                    </select>
                    <select className="selector" onChange={e => setSubjectId(e.target.value)}>
                        {
                            subjects.length ?
                                subjects.map(subject => 
                                    <option value={subject.id}
                                            key={subject.id}
                                    >
                                        { subject.name }
                                    </option>)
                            : <option>Нет доступных предметов</option>
                        }
                    </select>
                    <button onClick={exportToExcel} 
                            disabled={createEnabled} 
                            className="form_report"
                    >
                        Сформировать отчет
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Reports
