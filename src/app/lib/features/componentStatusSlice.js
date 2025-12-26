"use client";
import { createSlice } from "@reduxjs/toolkit";


const componentSlice = createSlice({
    name: "component",
    initialState: {
        showLoginStatus: false,
        showSignUpStatus: false,
        showCoursesStatus: false,
        showUpdateCoursesStatus: false,
        showProfileEdit: null,
    },
    reducers: {
        showLoginCard: (state) => {
            state.showLoginStatus = true;
            state.showSignUpStatus = false;
        },
        hideLoginCard: (state) => {
            state.showLoginStatus = false;
        },


        showSignUpCard: (state) => {
            state.showSignUpStatus = true;
            state.showLoginStatus = false;
        },
        hideSignUpCard: (state) => {
            state.showSignUpStatus = false;
        },


        showCourseAddForm: (state) => {
            state.showCoursesStatus = true
        },
        hideCourseAddForm: (state) => {
            state.showCoursesStatus = false
        },


        showUpdateCourseAddForm: (state, actions) => {
            state.showUpdateCoursesStatus = actions.payload;
        },
        hideUpdateCourseAddForm: (state) => {
            state.showUpdateCoursesStatus = false
        },


        showProfileEditCard: (state, actions) => {
            state.showProfileEdit = actions.payload;
        },
        hideProfileEditCard: (state) => {
            state.showProfileEdit = null
        }
    },
});

export const { showLoginCard, hideLoginCard,
    showSignUpCard, hideSignUpCard,
    showCourseAddForm, hideCourseAddForm,
    showUpdateCourseAddForm, hideUpdateCourseAddForm,
    showProfileEditCard, hideProfileEditCard } = componentSlice.actions;

export default componentSlice.reducer;
