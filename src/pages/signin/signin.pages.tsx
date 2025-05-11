import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginImage from '../../assets/login.jpg';

function SigninPage() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (data) => {
        if (!data.email || !data.password) {
            alert('Email and password are required');
            return;
        }
        console.log('Login attempt:', data);
        alert('Login submitted. Ready for backend integration.');
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
                                placeholder="Enter your email..."
                                {...register('email', { required: 'Email is required' })}
                                className="bg-white border-gray-300 h-10 text-sm"
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-base">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password..."
                                {...register('password', { required: 'Password is required' })}
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
