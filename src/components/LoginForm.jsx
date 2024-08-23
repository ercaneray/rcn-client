// src/components/LoginForm.jsx
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useLogin } from '../hooks/useLogin';
export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, error, isLoading } = useLogin();
    const toast = useRef(null);

    const onSubmit = async (e) => {
        await login(e.email, e.password);
    };

    return (
        <div className="login-form">
            <Toast ref={toast} />
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <Button type="submit" label="Login" className="p-button-success" disabled={isLoading} />
            </form>
            {error && <div className="error">{error}</div>}
            {/* <p>Don't have an account? <a href="/signup">Sign up</a></p> */}
        </div>
    );
}
