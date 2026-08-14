import axios from "./axios";


// =========================================================
// COMPLETE LESSON
// =========================================================

export const completeLesson = async (
    lessonId
) => {

    const response =
        await axios.post(
            `/student/lessons/${lessonId}/complete`
        );

    return response.data;
};


// =========================================================
// GET SINGLE LESSON PROGRESS
// =========================================================

export const getLessonProgress = async (
    lessonId
) => {

    const response =
        await axios.get(
            `/student/lessons/${lessonId}/progress`
        );

    return response.data;
};


// =========================================================
// GET COURSE LESSON PROGRESS
// =========================================================

export const getCourseProgress = async (
    courseId
) => {

    const response =
        await axios.get(
            `/student/courses/${courseId}/progress`
        );

    return response.data;
};


// =========================================================
// GET COURSE PROGRESS SUMMARY
// =========================================================

export const getCourseProgressSummary = async (
    courseId
) => {

    const response =
        await axios.get(
            `/student/courses/${courseId}/progress/summary`
        );

    return response.data;
};