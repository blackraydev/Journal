import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/schedule"
});

export const getScheduleRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createScheduleRequest = async (schedule) => {
    return await axiosInstance.post("/create", schedule)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const editScheduleRequest = async (editedSchedule) => {
    return await axiosInstance.post("/edit", editedSchedule)
        .then(response => response.data)
        .catch(e => { throw e })
}

export const deleteScheduleRequest = async (id) => {
    return await axiosInstance.delete(`/${id}`)
        .then(response => response.data)
        .catch(e => { throw e });
}