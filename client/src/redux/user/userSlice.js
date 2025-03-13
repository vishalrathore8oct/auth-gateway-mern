import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false, 
    error: false

}

const userSlice = createSlice({
    name: "user", 
    initialState, 
    reducers: {
        logInStart: (state) => {
            state.loading = true
            state.error = false
        }, 
        logInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = false
        }, 
        logInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }, 
        userUpdateStart: (state) => {
            state.loading = true
            state.error = false
        }, 
        userUpdateSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = false
        }, 
        userUpdateFailure: (state, action) => {
            state.loading = false
            state.error = action.payload 
        }, 

    }

})

export const { logInStart, logInSuccess, logInFailure, userUpdateStart, userUpdateSuccess, userUpdateFailure } = userSlice.actions

export default userSlice.reducer