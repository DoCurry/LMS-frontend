import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userAPI } from "@/api/api";
import { LoginDto } from "@/models/user.model";
import loginImage from '../../assets/login.jpg';

function SigninPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginDto) => {
        const loginPromise = userAPI.login(data);
        
        try {
            const response = await toast.promise(loginPromise, {
                loading: 'Logging in...',
                success: 'Welcome back!',
                error: (err) => {
                    if (err.response?.status === 401) {
                        return 'Invalid email or password';
                    }
                    if (err.response?.data?.message) {
                        return err.response.data.message;
                    }
                    if (err.message === 'Network Error') {
                        return 'Unable to connect to the server';
                    }
                    return 'Login failed. Please try again.';
                }
            });

            // Store the token and refresh token
            const { token, refreshToken } = response.data.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Store user info
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem('isAdmin', 
                (response.data.data.user.role === 1).toString()
            );
            // Redirect based on role and return path
            if (response.data.data.user.role === 1 || 2) {
                navigate('/admin');
            } else {
                // Navigate to the return path or home
                navigate(location.state?.from || '/');
            }
            
        } catch (error) {
            toast.error('Login error: '+error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
            <div className="bg-white rounded-lg w-full max-w-5xl mx-4 flex overflow-hidden min-h-[500px]">
                {/* Form Section */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold mb-6">Login</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-base">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email..."                                {...register('email', { 
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email format"
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Email cannot exceed 100 characters"
                                    }
                                })}
                                className="bg-white border-gray-300 h-10 text-sm"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-base">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password..."                                {...register('password', { 
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                className="bg-white border-gray-300 h-10 text-sm"
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

                            <div className="text-left pt-1">
                                <Link to="/forget-password" className="text-xs text-blue-500 hover:underline">
                                    Forgotten password?
                                </Link>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                        >
                            Login
                        </Button>

                        <div className="text-center mt-2 text-xs">
                            <span>Doesn't have an account? </span>
                            <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
                        </div>
                    </form>
                </div>

                {/* Image Section */}
                <div className="flex-1 hidden md:flex items-center justify-center bg-gray-100">
                    <img 
                        src={loginImage} 
                        alt="Login Illustration" 
                        className="object-contain w-full h-full p-4"
                    />
                </div>
            </div>
        </div>
    );
}

export default SigninPage;
