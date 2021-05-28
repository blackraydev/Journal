import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/teacherSubjects"
});

export const getTeacherSubjectsRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}