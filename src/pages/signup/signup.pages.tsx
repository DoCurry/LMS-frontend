import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import RegisterImage from '../../assets/register.jpg';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Signup() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch('password');

    const onSubmit = (data) => {
        console.log('Signup data:', data);
        alert('Signup successful! (Frontend-only demo)');
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl mx-4 shadow-sm flex">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-6">
                    <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Username</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name..."
                                {...register('name', { required: 'Username is required' })}
                                className="h-10"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

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
                                    }
                                })}
                                className="h-10"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
                                    }
                                })}
                                className="h-10"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password..."
                                {...register('confirmPassword', { 
                                    required: 'Confirm Password is required',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                className="h-10"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button 
                            type="submit"
                            className="w-full h-10 bg-green-600 hover:bg-green-700 text-white rounded-md"
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