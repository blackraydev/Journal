import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/marks"
});

export const getMarksRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createMarkRequest = async (mark) => {
    return await axiosInstance.post("/create", mark)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const editMarkRequest = async (editedMark) => {
    return await axiosInstance.post("/edit", editedMark)
        .then(response => response.data)
        .catch(e => { throw e })
}

export const deleteMarkRequest = async (id) => {
    return await axiosInstance.delete(`/${id}`)
        .then(response => response.data)
        .catch(e => { throw e });
}