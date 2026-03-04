import { useState, useEffect } from 'react';
import { Shield, Plus } from 'lucide-react';
import { teamApi } from '@/features/teams/api';
import type { User } from '@/features/projects/types';
import { UserTable } from '../components/UserTable';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreateUserModal } from '../components/CreateUserModal';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await teamApi.getUsers();
      usersData.sort((a, b) => a.username.localeCompare(b.username));
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditRole = (user: User) => {
    alert(`Editing role for ${user.username} is not fully implemented yet.`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      alert(`Deletion for ${user.username} is not fully implemented yet.`);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Users Management
          </h1>
          <p className="text-muted-foreground mt-0.5 text-[13px]">
            Manage all collaborators across the platform.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className={cn(
              "h-8 rounded-md text-[13px] font-medium gap-1.5",
              "bg-linear-to-br from-indigo-500 to-violet-600 text-white",
              "hover:brightness-110 hover:shadow-[0_0_0_3px_var(--accent-glow)]",
              "transition-all duration-150"
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Create User
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p className="text-muted-foreground text-[13px] animate-pulse">Loading users...</p>
        </div>
      ) : (
        <UserTable 
          users={users} 
          onEditRole={handleEditRole}
          onDeleteUser={handleDeleteUser}
        />
      )}

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
