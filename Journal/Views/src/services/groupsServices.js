import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:5001/api/groups"
});

export const getGroupsRequest = async () => {
    return await axiosInstance.get("/")
        .then(response => response.data)
        .catch(e => { throw e });
}

export const createGroupRequest = async (group) => {
    return await axiosInstance.post("/create", group)
        .then(response => response.data)
        .catch(e => { throw e });
}

export const editGroupRequest = async (editedGroup) => {
    return await axiosInstance.post("/edit", editedGroup)
        .then(response => response.data)
        .catch(e => { throw e })
}

export const deleteGroupRequest = async (id) => {
    return await axiosInstance.delete(`/${id}`)
        .then(response => response.data)
        .catch(e => { throw e });
}