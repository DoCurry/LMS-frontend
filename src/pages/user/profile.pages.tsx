import { useState, useEffect } from 'react';
import { userAPI } from '@/api/api';
import { UserDto } from '@/models/user.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

export default function UserProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    // Fetch user profile data
    userAPI.getMe()
      .then(response => {
        setUser(response.data);
        // Set form default values
        setValue('firstName', response.data.firstName);
        setValue('lastName', response.data.lastName);
        setValue('email', response.data.email);
        setValue('phoneNumber', response.data.phoneNumber);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (user) {
        await userAPI.update(user.id, data);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register('firstName')} />
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register('lastName')} />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} type="email" disabled />
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" {...register('phoneNumber')} />
        </div>
        
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
}
