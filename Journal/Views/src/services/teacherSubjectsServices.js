import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/teacherSubjects"
});

export const getTeacherSubjectsRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createTeacherSubjectRequest = async (teacherSubject) => {
    return await axiosInstance.post("/create", teacherSubject)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const deleteTeacherSubjectRequest = async (deletedTeacherSubject) => {
    return await axiosInstance.post("/delete", deletedTeacherSubject)
        .then(response => response.data)
        .catch(e => { throw e });
}