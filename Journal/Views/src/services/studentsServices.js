import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/students"
});

export const getStudentsRequest = async (groupId) => {
    return await axiosInstance.get(`/${groupId}`)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const getAllStudentsRequest = async () => {
    return await axiosInstance.get("/all")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const getAvailableStudentsRequest = async () => {
    return await axiosInstance.get("/available")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const addStudentToGroupRequest = async (student) => {
    return await axiosInstance.post("/create", student)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const removeStudentFromGroupRequest = async (student) => {
    return await axiosInstance.post("/delete", student)
        .then(response => response.data)
        .catch(e => { throw e });
}