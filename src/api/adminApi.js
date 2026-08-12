import axios from "./axios";

// =========================================================
// USERS
// =========================================================

export const getUsers = async () => {

    const response = await axios.get(
        "/admin/users"
    );

    return response.data;
};


export const getUser = async (
    userId
) => {

    const response = await axios.get(
        `/admin/users/${userId}`
    );

    return response.data;
};


export const enableUser = async (
    userId
) => {

    const response = await axios.put(
        `/admin/users/${userId}/enable`
    );

    return response.data;
};


export const disableUser = async (
    userId
) => {

    const response = await axios.put(
        `/admin/users/${userId}/disable`
    );

    return response.data;
};