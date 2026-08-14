import axios from "./axios";


// =========================================================
// DASHBOARD
// =========================================================

export const getAdminDashboard = async () => {

    const response =
        await axios.get(
            "/admin/dashboard"
        );

    return response.data;
};


// =========================================================
// USERS
// =========================================================

export const getAdminUsers = async ({
    search = "",
    role = ""
} = {}) => {

    const params = {};

    if (search.trim()) {
        params.search = search.trim();
    }

    if (role) {
        params.role = role;
    }

    const response =
        await axios.get(
            "/admin/users",
            {
                params
            }
        );

    return response.data;
};


export const getAdminUser = async (
    userId
) => {

    const response =
        await axios.get(
            `/admin/users/${userId}`
        );

    return response.data;
};


export const enableAdminUser = async (
    userId
) => {

    const response =
        await axios.put(
            `/admin/users/${userId}/enable`
        );

    return response.data;
};


export const disableAdminUser = async (
    userId
) => {

    const response =
        await axios.put(
            `/admin/users/${userId}/disable`
        );

    return response.data;
};


export const lockAdminUser = async (
    userId
) => {

    const response =
        await axios.put(
            `/admin/users/${userId}/lock`
        );

    return response.data;
};


export const unlockAdminUser = async (
    userId
) => {

    const response =
        await axios.put(
            `/admin/users/${userId}/unlock`
        );

    return response.data;
};


// =========================================================
// COURSES
// =========================================================

export const getAdminCourses = async ({
    search = "",
    grade = "",
    curriculum = ""
} = {}) => {

    const params = {};

    if (search.trim()) {
        params.search = search.trim();
    }

    if (grade) {
        params.grade = grade;
    }

    if (curriculum) {
        params.curriculum = curriculum;
    }

    const response =
        await axios.get(
            "/admin/courses",
            {
                params
            }
        );

    return response.data;
};


export const getAdminCourse = async (
    courseId
) => {

    const response =
        await axios.get(
            `/admin/courses/${courseId}`
        );

    return response.data;
};


export const publishAdminCourse = async (
    courseId
) => {

    const response =
        await axios.put(
            `/admin/courses/${courseId}/publish`
        );

    return response.data;
};


export const unpublishAdminCourse = async (
    courseId
) => {

    const response =
        await axios.put(
            `/admin/courses/${courseId}/unpublish`
        );

    return response.data;
};


// =========================================================
// ENROLLMENTS
// =========================================================

export const getAdminEnrollments = async (
    search = ""
) => {

    const params = {};

    if (search.trim()) {
        params.search = search.trim();
    }

    const response =
        await axios.get(
            "/admin/enrollments",
            {
                params
            }
        );

    return response.data;
};


export const getAdminEnrollment = async (
    enrollmentId
) => {

    const response =
        await axios.get(
            `/admin/enrollments/${enrollmentId}`
        );

    return response.data;
};


export const deleteAdminEnrollment = async (
    enrollmentId
) => {

    const response =
        await axios.delete(
            `/admin/enrollments/${enrollmentId}`
        );

    return response.data;
};


// =========================================================
// SUBJECTS
// =========================================================

export const getAdminSubjects = async (
    search = ""
) => {

    const params = {};

    if (search.trim()) {
        params.search = search.trim();
    }

    const response =
        await axios.get(
            "/admin/subjects",
            {
                params
            }
        );

    return response.data;
};


export const getAdminSubject = async (
    subjectId
) => {

    const response =
        await axios.get(
            `/admin/subjects/${subjectId}`
        );

    return response.data;
};


export const createAdminSubject = async (
    subjectData
) => {

    const response =
        await axios.post(
            "/admin/subjects",
            subjectData
        );

    return response.data;
};


export const updateAdminSubject = async (
    subjectId,
    subjectData
) => {

    const response =
        await axios.put(
            `/admin/subjects/${subjectId}`,
            subjectData
        );

    return response.data;
};


export const activateAdminSubject = async (
    subjectId
) => {

    const response =
        await axios.put(
            `/admin/subjects/${subjectId}/activate`
        );

    return response.data;
};


export const deactivateAdminSubject = async (
    subjectId
) => {

    const response =
        await axios.put(
            `/admin/subjects/${subjectId}/deactivate`
        );

    return response.data;
};


// =========================================================
// AUDIT LOGS
// =========================================================

export const getAdminAuditLogs = async () => {

    const response =
        await axios.get(
            "/admin/audit-logs"
        );

    return response.data;
};