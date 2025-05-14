import { useState, useEffect } from 'react';
import { User, Search, Mail, Key, CalendarDays, Check, X, AlertCircle } from 'lucide-react';
import { userAPI } from '@/api/api';
import { UserDto } from '@/models/user.model';
import { UserRole } from '@/models/enums';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogUser, setDeleteDialogUser] = useState<UserDto | null>(null);
  const [roleDialogUser, setRoleDialogUser] = useState<UserDto | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err?.response?.data?.error || 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user status (activate/deactivate)
  const handleToggleActive = async (user: UserDto) => {
    try {
      if (user.isActive) {
        await userAPI.deactivate(user.id);
        toast.success('User deactivated successfully');
      } else {
        await userAPI.activate(user.id);
        toast.success('User activated successfully');
      }
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || `Failed to ${user.isActive ? 'deactivate' : 'activate'} user`);
    }
  };

  // Delete user
  const handleDelete = async (user: UserDto) => {
    try {
      await userAPI.delete(user.id);
      toast.success('User deleted successfully');
      setDeleteDialogUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete user');
    }
  };  // Update user role
  const handleUpdateRole = async () => {
    if (!roleDialogUser || !newRole) return;

    try {
      await userAPI.updateRole(roleDialogUser.id, Number(newRole));
      toast.success('User role updated successfully');
      setRoleDialogUser(null);
      setNewRole('');
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to update user role');
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-gray-500 mt-2">Manage library users and their access.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between gap-2 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Info</TableHead>
                <TableHead>Membership ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Statistics</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.membershipId}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>                  <TableCell>
                    <Badge variant={user.role === 1 ? 'default' : 'secondary'}>
                      {UserRole[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Orders: {user.orderCount}</div>
                      <div>Reviews: {user.reviewCount}</div>
                      <div>Bookmarks: {user.bookmarkCount}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={user.isActive ? "destructive" : "default"}
                        onClick={() => handleToggleActive(user)}
                        className="flex items-center gap-1"
                      >
                        {user.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setRoleDialogUser(user)}
                        className="flex items-center gap-1"
                      >
                        <User className="h-4 w-4" />
                        Change Role
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteDialogUser(user)}
                        className="flex items-center gap-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteDialogUser} onOpenChange={() => setDeleteDialogUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteDialogUser && (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-4 bg-muted">
                <div className="font-medium">{deleteDialogUser.username}</div>
                <div className="text-sm text-muted-foreground">{deleteDialogUser.email}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Member since {new Date(deleteDialogUser.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogUser(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogUser && handleDelete(deleteDialogUser)}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={!!roleDialogUser} onOpenChange={() => setRoleDialogUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user. This will change their permissions in the system.
            </DialogDescription>
          </DialogHeader>

          {roleDialogUser && (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-4 bg-muted">
                <div className="font-medium">{roleDialogUser.username}</div>
                <div className="text-sm text-muted-foreground">{roleDialogUser.email}</div>                <div className="text-sm text-muted-foreground mt-2">
                  Current Role: <Badge>{UserRole[roleDialogUser.role]}</Badge>
                </div>
              </div>              <Select
                value={newRole}
                onValueChange={setNewRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Member</SelectItem>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogUser(null)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleUpdateRole}
              disabled={!newRole || newRole === String(roleDialogUser?.role)}
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
