import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function StaffPickupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    const confirm = window.confirm(
      `Confirm claim for Member ID: ${data.memberId} and Claim Code: ${data.claimCode}?`
    );
    if (confirm) {
      alert("Claim confirmed!");
      console.log("Claim Data:", data);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-6">LMS Admin Panel</h2>
          <nav className="text-sm space-y-2">
            <a href="#" className="text-blue-400 font-semibold">Claim</a>
          </nav>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 w-full mt-6">Logout</Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-1">Claim</h1>
        <p className="text-sm text-gray-500 mb-6">Confirm a book claim using member credentials</p>

        <div className="bg-white p-6 rounded-lg shadow max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="memberId" className="mb-1 block">Membership ID</Label>
              <Input
                id="memberId"
                placeholder="Enter Membership ID"
                {...register('memberId', { required: 'Membership ID is required' })}
                className="h-10"
              />
              {errors.memberId && (
                <p className="text-sm text-red-500 mt-1">{errors.memberId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="claimCode" className="mb-1 block">Claim Code</Label>
              <Input
                id="claimCode"
                placeholder="Enter Claim Code"
                {...register('claimCode', { required: 'Claim Code is required' })}
                className="h-10"
              />
              {errors.claimCode && (
                <p className="text-sm text-red-500 mt-1">{errors.claimCode.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm Claim
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default StaffPickupPage;
