import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { userAPI } from '@/api/api';
import { UserDto, UpdateUserDto } from '@/models/user.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UpdateUserDto & { password: string; currentPassword: string; confirmPassword: string; }>();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);      const response = await userAPI.getMe();
      const userData = response.data.data;
      setUser(userData);
      // Set form default values
      setValue('username', userData.username);
      setValue('email', userData.email);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: UpdateUserDto & { password: string; currentPassword: string; confirmPassword: string; }) => {
    try {
      if (!user) return;

      // Handle profile update
      if (data.email || data.username) {
        const updateData: UpdateUserDto = {};
        if (data.email) updateData.email = data.email;
        if (data.username) updateData.username = data.username;

        await toast.promise(
          userAPI.update(user.id, updateData),
          {
            loading: 'Updating profile...',
            success: 'Profile updated successfully!',
            error: 'Failed to update profile'
          }
        );

        // Refresh user data
        await fetchUserProfile();
      }

      // Handle password change
      if (data.currentPassword && data.password && data.confirmPassword) {
        if (data.password !== data.confirmPassword) {
          toast.error('New password and confirmation do not match');
          return;
        }

        await toast.promise(
          userAPI.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.password
          }),
          {
            loading: 'Changing password...',
            success: 'Password changed successfully!',
            error: 'Failed to change password'
          }
        );

        // Clear password fields
        setValue('currentPassword', '');
        setValue('password', '');
        setValue('confirmPassword', '');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Profile Not Found</h2>
          <p className="text-gray-600 mt-2">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardContent className="p-6">              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        {...register('username', {
                          minLength: {
                            value: 3,
                            message: 'Username must be at least 3 characters'
                          },
                          maxLength: {
                            value: 50,
                            message: 'Username cannot exceed 50 characters'
                          }
                        })}
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register('email', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email format"
                          },
                          maxLength: {
                            value: 100,
                            message: "Email cannot exceed 100 characters"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password"
                        {...register('currentPassword')}
                      />
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input 
                        id="password" 
                        type="password"
                        {...register('password', {
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          },
                          maxLength: {
                            value: 100,
                            message: 'Password cannot exceed 100 characters'
                          }
                        })}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        {...register('confirmPassword')}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Leave password fields empty if you don't want to change your password.
                  </p>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900">Orders</h3>
                  <p className="text-2xl font-semibold text-blue-600 mt-2">
                    {user.orderCount}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">Total orders placed</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900">Reviews</h3>
                  <p className="text-2xl font-semibold text-green-600 mt-2">
                    {user.reviewCount}
                  </p>
                  <p className="text-sm text-green-700 mt-1">Books reviewed</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900">Bookmarks</h3>
                  <p className="text-2xl font-semibold text-purple-600 mt-2">
                    {user.bookmarkCount}
                  </p>
                  <p className="text-sm text-purple-700 mt-1">Books bookmarked</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">
                      {new Date(user.lastUpdated || user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Account Status</span>
                    <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Discount Available</span>
                    <span className={user.isDiscountAvailable ? 'text-green-600' : 'text-gray-600'}>
                      {user.isDiscountAvailable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
