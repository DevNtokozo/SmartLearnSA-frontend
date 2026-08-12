import axios from "./axios";


// =========================================================
// TUTOR - ASSIGNMENTS
// =========================================================

export const getTutorAssignments = async () => {

    const response =
        await axios.get(
            "/tutor/assignments"
        );

    return response.data;
};


export const getCourseAssignments = async (
    courseId
) => {

    const response =
        await axios.get(
            `/tutor/courses/${courseId}/assignments`
        );

    return response.data;
};


export const createAssignment = async (
    assignmentData
) => {

    const response =
        await axios.post(
            "/tutor/assignments",
            assignmentData
        );

    return response.data;
};


export const updateAssignment = async (
    assignmentId,
    assignmentData
) => {

    const response =
        await axios.put(
            `/tutor/assignments/${assignmentId}`,
            assignmentData
        );

    return response.data;
};


export const deleteAssignment = async (
    assignmentId
) => {

    const response =
        await axios.delete(
            `/tutor/assignments/${assignmentId}`
        );

    return response.data;
};


export const publishAssignment = async (
    assignmentId
) => {

    const response =
        await axios.put(
            `/tutor/assignments/${assignmentId}/publish`
        );

    return response.data;
};


export const unpublishAssignment = async (
    assignmentId
) => {

    const response =
        await axios.put(
            `/tutor/assignments/${assignmentId}/unpublish`
        );

    return response.data;
};


// =========================================================
// STUDENT
// =========================================================

export const getStudentAssignments = async () => {

    const response =
        await axios.get(
            "/student/assignments"
        );

    return response.data;
};


export const getAssignment = async (
    assignmentId
) => {

    const response =
        await axios.get(
            `/assignments/${assignmentId}`
        );

    return response.data;
};


// =========================================================
// STUDENT - SUBMISSIONS
// =========================================================

export const submitAssignment = async (
    assignmentId,
    submissionData
) => {

    const response =
        await axios.post(
            `/student/assignments/${assignmentId}/submit`,
            submissionData
        );

    return response.data;
};


export const getMySubmission = async (
    assignmentId
) => {

    const response =
        await axios.get(
            `/student/assignments/${assignmentId}/submission`
        );

    return response.data;
};


export const getMySubmissions = async () => {

    const response =
        await axios.get(
            "/student/submissions"
        );

    return response.data;
};


// =========================================================
// TUTOR - SUBMISSIONS
// =========================================================

export const getAssignmentSubmissions = async (
    assignmentId
) => {

    const response =
        await axios.get(
            `/tutor/assignments/${assignmentId}/submissions`
        );

    return response.data;
};


export const gradeSubmission = async (
    submissionId,
    gradeData
) => {

    const response =
        await axios.put(
            `/tutor/submissions/${submissionId}/grade`,
            gradeData
        );

    return response.data;
};