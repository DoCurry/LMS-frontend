import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import RegisterImage from '../../assets/register.jpg';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userAPI } from "@/api/api";
import { RegisterDto } from "@/models/user.model";

function Signup() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterDto>();

    const onSubmit = async (data: RegisterDto) => {
        const registerPromise = userAPI.register(data);
        
        try {
            await toast.promise(registerPromise, {
                loading: 'Creating your account...',
                success: 'Registration successful! Redirecting to login...',
                error: 'Registration failed'
            });
            
            // Short delay before redirect to show success message
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            
        } catch (error: any) {
            // Handle API errors
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 400) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach(key => {
                    setError(key as keyof RegisterDto, {
                        message: validationErrors[key][0]
                    });
                });
                toast.error('Please check the form for errors');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl mx-4 shadow-sm flex">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-6">
                    <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email..."
                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Email cannot exceed 100 characters"
                                    }
                                })}
                                className="h-10"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Choose a username..."
                                {...register('username', { 
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message: 'Username must be at least 3 characters'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Username cannot exceed 50 characters'
                                    }
                                })}
                                className="h-10"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password..."
                                {...register('password', { 
                                    required: 'Password is required',
                                    minLength: { 
                                        value: 6, 
                                        message: 'Password must be at least 6 characters'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Password cannot exceed 100 characters'
                                    }
                                })}
                                className="h-10"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Sign Up Button */}
                        <Button 
                            type="submit"
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Sign Up
                        </Button>

                        <div className="text-center text-sm mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login here
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Image Section */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 bg-gray-50 rounded-r-lg">
                    <img 
                        src={RegisterImage} 
                        alt="Signup Illustration" 
                        className="w-full h-full object-cover rounded-r-lg"
                    />
                </div>
            </div>
        </div>
    );
}

export default Signup;
