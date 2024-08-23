import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }


            localStorage.setItem('user', JSON.stringify(json));

            dispatch({ type: "LOGIN", payload: json });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError("An unexpected error occurred.");
        }



    }
    return { signup, error, isLoading };
}      