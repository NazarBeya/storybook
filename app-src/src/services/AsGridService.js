/**
 * The reducer
 * @param {object} state - the state passed in by useReducer
 * @param {object} updatedValues - the new values
 */
export const apiParamsReducer = (state, updatedValues) => ({
    ...state,
    ...updatedValues
});
