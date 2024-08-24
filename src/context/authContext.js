import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                loading: false
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                loading: false
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            };
        case 'SET_NOT_LOADING':
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({
                type: 'LOGIN',
                payload: user
            });
        } else {
            dispatch({
                type: 'SET_NOT_LOADING'
            });
        }
    }, []);


    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
