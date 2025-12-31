"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

let URL = "/api/user"

export const createUser = createAsyncThunk(
    "users/createUser",
    async (formData) => {
        try {
            const response = await axios.post(URL, formData);
            console.log(response)
            if (response.data.status) {
                const email = formData.get("email");
                const password = formData.get("password");
                console.log(email, password);
                await signIn('credentials', { redirect: false, email, password });
                if (response.data.status) {
                    toast(response.data.message);
                }
            }
        } catch (error) {
            return console.error(error);
        }


    }
)

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (formData) => {
        try {

            console.log("Done")
            const response = await axios.put(URL, formData);
            if (response.data.status) {
                console.log(response.data.message)
                return response.data.message
            }


        } catch (error) {
            return console.error(error);
        }


    }
);

export const getEnrolledStudents = createAsyncThunk(
    "users/getEnrolledStudents",
    async () => {
        try {
            const response = await axios.get("/api/instructor/student");
            if (response.data.status) {
                return response.data.message
            }

        } catch (error) {
            return console.error(error);
        }


    }
);


const usersSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
        loading: false,
        enrolledStudents: [],
    },

    reducers: {
        falseUserUpdateLoading: (state) => {
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true
            })

            .addCase(getEnrolledStudents.fulfilled, (state, action) => {
                state.enrolledStudents = action.payload
            })
    }

});

export const { falseUserUpdateLoading } = usersSlice.actions;
export default usersSlice.reducer;
