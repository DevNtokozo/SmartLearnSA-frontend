import axios from "./axios";


// =========================================================
// TUTOR - MY PROFILE
// =========================================================

export const getTutorProfile = async () => {

    const response =
        await axios.get(
            "/tutor/profile"
        );

    return response.data;
};


export const updateTutorProfile = async (
    profileData
) => {

    const response =
        await axios.put(
            "/tutor/profile",
            profileData
        );

    return response.data;
};


// =========================================================
// PUBLIC TUTOR PROFILE
// =========================================================

export const getPublicTutorProfile = async (
    tutorId
) => {

    const response =
        await axios.get(
            `/tutor/public/${tutorId}`
        );

    return response.data;
};

export const disableTutor = async (tutorId) => {

    const response =
        await axios.put(
            `/admin/tutors/${tutorId}/disable`
        );

    return response.data;
};