// src/components/SignupForm.jsx
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useSignup } from '../hooks/useSignup';

export default function SignupForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, error, isLoading } = useSignup();
    const toast = useRef(null);

    const onSubmit = async (e) => {
        await signup(e.name, e.email, e.password);
    }

    return (
        <div className="signup-form">
            <Toast ref={toast} />
            <h2 className="signup-title">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

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

                <Button type="submit" label="Sign Up" className="p-button-success" disabled={isLoading} />
                {error && <div className="error">{error}</div>}
            </form>
            <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
    );
}
