import axios from "./axios";


// =========================================================
// STUDENT / PUBLIC
// =========================================================

export const getCourseLessons = async (
    courseId
) => {

    const response =
        await axios.get(
            `/courses/${courseId}/lessons`
        );

    return response.data;
};


export const getLesson = async (
    lessonId
) => {

    const response =
        await axios.get(
            `/lessons/${lessonId}`
        );

    return response.data;
};


// =========================================================
// TUTOR
// =========================================================

export const getTutorCourseLessons = async (
    courseId
) => {

    const response =
        await axios.get(
            `/tutor/courses/${courseId}/lessons`
        );

    return response.data;
};


export const createLesson = async (
    courseId,
    lessonData
) => {

    const response =
        await axios.post(
            `/tutor/courses/${courseId}/lessons`,
            lessonData
        );

    return response.data;
};


export const updateLesson = async (
    lessonId,
    lessonData
) => {

    const response =
        await axios.put(
            `/tutor/lessons/${lessonId}`,
            lessonData
        );

    return response.data;
};


export const publishLesson = async (
    lessonId
) => {

    const response =
        await axios.put(
            `/tutor/lessons/${lessonId}/publish`
        );

    return response.data;
};


export const unpublishLesson = async (
    lessonId
) => {

    const response =
        await axios.put(
            `/tutor/lessons/${lessonId}/unpublish`
        );

    return response.data;
};


export const deleteLesson = async (
    lessonId
) => {

    const response =
        await axios.delete(
            `/tutor/lessons/${lessonId}`
        );

    return response.data;
};