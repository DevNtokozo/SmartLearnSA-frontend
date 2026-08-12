import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    Image,
    Loader2,
    Save
} from "lucide-react";

import {
    getCourse,
    updateCourse
} from "../../api/courseApi";

import {
    getSubjects
} from "../../api/subjectApi";

const GRADE_OPTIONS = [
    "GRADE_R",
    "GRADE_1",
    "GRADE_2",
    "GRADE_3",
    "GRADE_4",
    "GRADE_5",
    "GRADE_6",
    "GRADE_7",
    "GRADE_8",
    "GRADE_9",
    "GRADE_10",
    "GRADE_11",
    "GRADE_12"
];

const CURRICULUM_OPTIONS = [
    "CAPS",
    "IEB"
];


export default function EditCourse() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [course, setCourse] =
        useState(null);

    const [subjects, setSubjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const [form, setForm] =
        useState({

            title: "",
            description: "",
            thumbnail: "",
            subjectId: "",
            grade: "",
            curriculum: ""

        });


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Course ID is missing."
            );

            setLoading(false);

            return;
        }

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                courseData,
                subjectData
            ] = await Promise.all([

                getCourse(id),

                getSubjects()

            ]);


            setCourse(
                courseData
            );


            setSubjects(
                Array.isArray(subjectData)
                    ? subjectData
                    : []
            );


            setForm({

                title:
                    courseData.title || "",

                description:
                    courseData.description || "",

                thumbnail:
                    courseData.thumbnail || "",

                subjectId:
                    courseData.subjectId ?? "",

                grade:
                    courseData.grade || "",

                curriculum:
                    courseData.curriculum || ""

            });

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load course."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // FORM
    // =========================================================

    const handleChange = event => {

        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async event => {

        event.preventDefault();

        setError("");


        if (!form.title.trim()) {

            setError(
                "Course title is required."
            );

            return;
        }


        if (!form.subjectId) {

            setError(
                "Please select a subject."
            );

            return;
        }


        if (!form.grade) {

            setError(
                "Please select a grade."
            );

            return;
        }


        if (!form.curriculum) {

            setError(
                "Please select a curriculum."
            );

            return;
        }


        try {

            setSaving(true);


            const data = {

                title:
                    form.title.trim(),

                description:
                    form.description.trim()
                        || null,

                thumbnail:
                    form.thumbnail.trim()
                        || null,

                subjectId:
                    Number(form.subjectId),

                grade:
                    form.grade,

                curriculum:
                    form.curriculum

            };


            const updated =
                await updateCourse(
                    id,
                    data
                );


            setCourse(updated);


            navigate(
                "/tutor/courses"
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update course."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={40}
                        className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-4 text-gray-500">
                        Loading course...
                    </p>

                </div>

            </div>
        );
    }


    if (error && !course) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/tutor/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                >

                    <ArrowLeft size={18} />

                    Back to Courses

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <h1 className="text-xl font-bold text-red-800">
                        Unable to load course
                    </h1>

                    <p className="mt-2 text-red-700">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    return (

        <motion.div
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            className="mx-auto max-w-3xl pb-10"
        >

            <Link
                to="/tutor/courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Courses

            </Link>


            <div className="mt-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <BookOpen size={25} />

                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Edit Course
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Update your course information.
                        </p>

                    </div>

                </div>

            </div>


            {error && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>

            )}


            <motion.form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Course Title *
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        maxLength={150}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Subject *
                    </label>

                    <select
                        name="subjectId"
                        value={form.subjectId}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >

                        <option value="">
                            Select subject
                        </option>

                        {subjects.map(subject => (

                            <option
                                key={subject.id}
                                value={subject.id}
                            >

                                {subject.name}

                            </option>

                        ))}

                    </select>

                </div>


                <div className="grid gap-6 sm:grid-cols-2">

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Grade *
                        </label>

                        <select
                            name="grade"
                            value={form.grade}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            <option value="">
                                Select grade
                            </option>

                            {GRADE_OPTIONS.map(grade => (

                                <option
                                    key={grade}
                                    value={grade}
                                >

                                    {grade.replace(
                                        "GRADE_",
                                        "Grade "
                                    )}

                                </option>

                            ))}

                        </select>

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Curriculum *
                        </label>

                        <select
                            name="curriculum"
                            value={form.curriculum}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            <option value="">
                                Select curriculum
                            </option>

                            {CURRICULUM_OPTIONS.map(
                                curriculum => (

                                    <option
                                        key={curriculum}
                                        value={curriculum}
                                    >
                                        {curriculum}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Thumbnail URL
                    </label>

                    <div className="relative">

                        <Image
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="url"
                            name="thumbnail"
                            value={form.thumbnail}
                            onChange={handleChange}
                            placeholder="https://example.com/course.jpg"
                            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                </div>


                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-semibold text-gray-700">
                                Course Status
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Publishing is managed from the course list.
                            </p>

                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                course.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                        >

                            {course.published
                                ? "Published"
                                : "Draft"}

                        </span>

                    </div>

                </div>


                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        to="/tutor/courses"
                        className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Saving...

                            </>

                        ) : (

                            <>
                                <Save size={18} />

                                Save Changes

                            </>

                        )}

                    </button>

                </div>

            </motion.form>

        </motion.div>
    );
}