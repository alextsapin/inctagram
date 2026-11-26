import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SuccessAlertState = {
    // Текст сообщения. null: сообщения нет
    message: string | null;
};

const initialState: SuccessAlertState = {
    message: null,
};

export const successAlertSlice = createSlice({
    name: 'successAlert',
    initialState,
    reducers: {
        showSuccess: (state, action: PayloadAction<string>): void => {
            state.message = action.payload;
        },
        hideSuccess: (state): void => {
            state.message = null;
        },
    },
});

export const { showSuccess, hideSuccess } = successAlertSlice.actions;
export const successAlertReducer = successAlertSlice.reducer;

// Достаёт текст сообщения из стора. Слайс лежит в сторе под ключом successAlert
// (см. makeStore в src/app/store)
export const selectSuccessMessage = (state: {
    successAlert: SuccessAlertState;
}): string | null => state.successAlert.message;
