import axios from "./axios";

// =========================================================
// ENROLL
// =========================================================

export const enrollInCourse = async (
    courseId
) => {

    const response =
        await axios.post(
            `/student/courses/${courseId}/enroll`
        );

    return response.data;
};


// =========================================================
// MY COURSES
// =========================================================

export const getMyCourses = async () => {

    const response =
        await axios.get(
            "/student/courses"
        );

    return response.data;
};


// =========================================================
// CHECK ENROLLMENT
// =========================================================

export const isEnrolled = async (
    courseId
) => {

    const response =
        await axios.get(
            `/student/courses/${courseId}/enrolled`
        );

    return response.data;
};


// =========================================================
// UNENROLL
// =========================================================

export const unenrollFromCourse = async (
    courseId
) => {

    const response =
        await axios.delete(
            `/student/courses/${courseId}/enroll`
        );

    return response.data;
};