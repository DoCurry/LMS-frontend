// React Router's Link component for navigation
import { Link } from 'react-router-dom';
// React Hook Form for form handling and validation
import { useForm } from 'react-hook-form';
// Custom UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Login illustration image
import loginImage from '../../assets/login.jpg';

function SigninPage() {
    // Initialize form handling with default values and validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    // Form submit handler
    const onSubmit = (data) => {
        if (!data.email || !data.password) {
            alert('Email and password are required');
            return;
        }
        // Placeholder action for now
        console.log('Login attempt:', data);
        alert('Login submitted. Ready for backend integration.');
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
            {/* Main card container */}
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl mx-4 flex">
                
                {/* Left side: Form section */}
                <div className="w-full md:w-1/2 p-4">
                    <h1 className="text-xl font-bold mb-4">Login</h1>
                    
                    {/* Form with validation and styling */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        
                        {/* Email field */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-base">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email..."
                                {...register('email', { required: 'Email is required' })}
                                className="bg-white border-gray-300 h-9 text-sm"
                            />
                            {/* Display validation error */}
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>
                        
                        {/* Password field */}
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-base">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password..."
                                {...register('password', { required: 'Password is required' })}
                                className="bg-white border-gray-300 h-9 text-sm"
                            />
                            {/* Display validation error */}
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            
                            {/* Forgot password link */}
                            <div className="text-left pt-1">
                                <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
                                    Forgotten password?
                                </Link>
                            </div>
                        </div>

                        {/* Login button */}
                        <Button 
                            type="submit"
                            className="w-full h-9 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                        >
                            Login
                        </Button>

                        {/* Link to signup */}
                        <div className="text-center mt-2 text-xs">
                            <span>Doesn't have an account? </span>
                            <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
                        </div>
                    </form>
                </div>
                
                {/* Right side: Image section (hidden on small screens) */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center overflow-hidden rounded-r-lg">
                    <img 
                        src={loginImage} 
                        alt="Login Illustration" 
                        className="w-full h-full object-cover"
                        style={{
                            minHeight: '100%',
                            minWidth: '100%'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default SigninPage;
