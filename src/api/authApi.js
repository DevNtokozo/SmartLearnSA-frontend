import axios from "./axios";


// =========================================================
// REGISTER
// =========================================================

export const register = async (
    registrationData
) => {

    const response =
        await axios.post(
            "/auth/register",
            registrationData
        );

    return response.data;
};


// =========================================================
// LOGIN
// =========================================================

export const login = async (
    credentials
) => {

    const response =
        await axios.post(
            "/auth/login",
            credentials
        );

    return response.data;
};


// =========================================================
// CURRENT USER
// =========================================================

export const getCurrentUser = async () => {

    const response =
        await axios.get(
            "/auth/me"
        );

    return response.data;
};


// =========================================================
// LOGOUT
// =========================================================

export const logout = async () => {

    const response =
        await axios.post(
            "/auth/logout"
        );

    return response.data;
};