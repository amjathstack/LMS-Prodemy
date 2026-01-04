"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let URL = "/api/instructor/course";

export const fetchInstructorCourses = createAsyncThunk(
    "courses/fetchInstructorCourses",
    async () => {
        try {
            const response = await axios.get(URL);
            if (response.status) {
                return response.data.message
            }

        } catch (error) {
            return console.error(error.message);
        }
    }
);


export const addCourse = createAsyncThunk(
    "courses/addCourse",
    async (formData) => {
        try {

            const response = await axios.post(URL, formData);
            console.log(response.data)
            return response.data.message

        } catch (error) {

            return console.error(error.message)

        }
    }
);

export const updateCourse = createAsyncThunk(
    "courses/updateCourse",
    async (formData) => {
        try {

            const response = await axios.put(URL, formData);
            return response.data.message

        } catch (error) {

            return console.error(error.message)

        }
    }
);


export const deleteCourse = createAsyncThunk(
    "course/deleteCourse",
    async (courseId) => {
        try {

            const response = await axios.delete(URL, { data: { Id: courseId }, headers: { "Content-Type": "application" } })
            return response.data.message

        } catch (error) {

            console.error(error.message)

        }
    }
)



const coursesSlice = createSlice({
    name: "courses",
    initialState: {
        loading: false,
        instructorCoursesList: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCourse.fulfilled, (state, actions) => {
                state.instructorCoursesList.push(actions.payload);
                state.loading = false
            })
            .addCase(addCourse.pending, (state) => {
                state.loading = true
            })


            .addCase(updateCourse.fulfilled, (state, action) => {
                state.instructorCoursesList = state.instructorCoursesList.map((item) => item._id === action.payload._id ? action.payload : item);
                state.loading = false
            })
            .addCase(updateCourse.pending, (state) => {
                state.loading = true
            })


            .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
                state.instructorCoursesList = action.payload;
                state.loading = false
            })
            .addCase(fetchInstructorCourses.pending, (state) => {
                state.loading = true
            })
    }

});

export const { addCourseIns, deleteCourseIns, addCommentIns, updateStudentsCountIns } = coursesSlice.actions;
export default coursesSlice.reducer;
