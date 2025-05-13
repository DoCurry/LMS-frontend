import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '@/api/api';
import { SendPasswordResetCodeDto, ResetPasswordDto } from '@/models/user.model';
import toast from 'react-hot-toast';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Form for requesting reset code
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    watch: watchEmail,
    formState: { errors: emailErrors },
  } = useForm<SendPasswordResetCodeDto>();

  // Form for resetting password
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    watch: watchReset,
  } = useForm<ResetPasswordDto>();

  const email = watchEmail('email');
  const newPassword = watchReset('newPassword');

  const onRequestCode = async (data: SendPasswordResetCodeDto) => {
    try {
      await toast.promise(userAPI.forgotPassword(data), {
        loading: 'Sending reset code...',
        success: 'Reset code sent to your email!',
        error: (err) => err.response?.data?.message || 'Failed to send reset code'
      });
      setIsCodeSent(true);
    } catch (error) {
      console.error('Reset code request error:', error);
    }
  };

  const onResetPassword = async (data: ResetPasswordDto) => {
    try {
      // Add email from the first form
      const resetData = {
        ...data,
        email: email,
      };

      await toast.promise(userAPI.resetPassword(resetData), {
        loading: 'Resetting password...',
        success: 'Password reset successful!',
        error: (err) => err.response?.data?.message || 'Failed to reset password'
      });
      
      // Short delay before redirect
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successful. Please login with your new password.' }
        });
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCodeSent ? 'Reset Password' : 'Forgot Password'}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          {isCodeSent 
            ? 'Enter the code sent to your email and your new password.'
            : 'Enter your email and we will send you a reset code.'}
        </p>

        {!isCodeSent ? (
          // Email Form
          <form onSubmit={handleEmailSubmit(onRequestCode)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                {...registerEmail('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="h-10"
              />
              {emailErrors.email && (
                <p className="text-sm text-red-500 mt-1">{emailErrors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
            >
              Send Reset Code
            </Button>
          </form>
        ) : (
          // Reset Password Form
          <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-4">
            <div>
              <Label htmlFor="resetCode">Reset Code</Label>
              <Input
                id="resetCode"
                type="text"
                placeholder="Enter reset code..."
                {...registerReset('resetCode', {
                  required: 'Reset code is required'
                })}
                className="h-10"
              />
              {resetErrors.resetCode && (
                <p className="text-sm text-red-500 mt-1">{resetErrors.resetCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password..."
                {...registerReset('newPassword', {
                  required: 'New password is required',
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
              {resetErrors.newPassword && (
                <p className="text-sm text-red-500 mt-1">{resetErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password..."
                {...registerReset('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                className="h-10"
              />
              {resetErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{resetErrors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
            >
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center text-sm mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
