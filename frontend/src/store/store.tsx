import { configureStore } from '@reduxjs/toolkit';
import inviteReducer from '../redux/inviteReducer';

export const store = configureStore({
  reducer: {
    inviter: inviteReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;