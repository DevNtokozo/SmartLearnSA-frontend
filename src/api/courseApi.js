import axios from "./axios";


// =========================================================
// PUBLIC / STUDENT
// =========================================================

export const getCourses = async () => {

    const response =
        await axios.get(
            "/courses"
        );

    return response.data;
};


export const getCourse = async (
    courseId
) => {

    const response =
        await axios.get(
            `/courses/${courseId}`
        );

    return response.data;
};


// =========================================================
// TUTOR
// =========================================================

export const getTutorCourses = async () => {

    const response =
        await axios.get(
            "/tutor/courses"
        );

    return response.data;
};


export const createCourse = async (
    courseData
) => {

    const response =
        await axios.post(
            "/tutor/courses",
            courseData
        );

    return response.data;
};


export const updateCourse = async (
    courseId,
    courseData
) => {

    const response =
        await axios.put(
            `/tutor/courses/${courseId}`,
            courseData
        );

    return response.data;
};


export const publishCourse = async (
    courseId
) => {

    const response =
        await axios.put(
            `/tutor/courses/${courseId}/publish`
        );

    return response.data;
};


export const unpublishCourse = async (
    courseId
) => {

    const response =
        await axios.put(
            `/tutor/courses/${courseId}/unpublish`
        );

    return response.data;
};


export const deleteCourse = async (
    courseId
) => {

    const response =
        await axios.delete(
            `/tutor/courses/${courseId}`
        );

    return response.data;
};