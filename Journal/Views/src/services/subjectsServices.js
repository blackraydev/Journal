import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/subjects"
});

export const getSubjectsRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createSubjectRequest = async (subject) => {
    return await axiosInstance.post("/create", subject)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const editSubjectRequest = async (editedSubject) => {
    return await axiosInstance.post("/edit", editedSubject)
        .then(response => response.data)
        .catch(e => { throw e })
}

export const deleteSubjectRequest = async (id) => {
    return await axiosInstance.delete(`/${id}`)
        .then(response => response.data)
        .catch(e => { throw e });
}