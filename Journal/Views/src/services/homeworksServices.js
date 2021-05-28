import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/homeworks"
});

export const getHomeworksRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createHomeworkRequest = async (homework) => {
    return await axiosInstance.post("/create", homework)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const saveHomeworkRequest = async (homework) => {
    return await axiosInstance.post("/save", homework)
        .then(response => response.data)
        .catch(e => { throw e });
}