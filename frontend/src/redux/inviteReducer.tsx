import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

export interface InviteState {
    state: number
}

const initialState: InviteState = {
    state: 0
}

export const inviteSlice = createSlice({
    name: 'inviter',
    initialState,
    reducers: {
        invited: (state) => {
            state.state ++;
        }
    }
});

export const {invited} = inviteSlice.actions;

export default inviteSlice.reducer;