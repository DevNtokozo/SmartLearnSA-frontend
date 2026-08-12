import axios from "./axios";


// =========================================================
// SUBJECTS
// =========================================================

export const getSubjects = async () => {

    const response =
        await axios.get(
            "/subjects"
        );

    return response.data;
};


export const getSubject = async (
    subjectId
) => {

    const response =
        await axios.get(
            `/subjects/${subjectId}`
        );

    return response.data;
};