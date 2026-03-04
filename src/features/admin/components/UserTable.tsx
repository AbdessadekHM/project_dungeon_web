import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { User } from '@/features/projects/types';

interface UserTableProps {
  users: User[];
  onUserSelect?: (user: User) => void;
  onEditRole?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

export function UserTable({ users, onUserSelect, onEditRole, onDeleteUser }: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const query = searchQuery.toLowerCase();
      return user.username.toLowerCase().includes(query) || 
             user.email.toLowerCase().includes(query) ||
             (user.phone && user.phone.includes(query));
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-[200px] lg:w-[300px]">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-[13px] pl-8 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          {searchQuery && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
              className="h-8 px-2 text-muted-foreground text-[13px]"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="w-[300px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">User</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Contact</TableHead>
              <TableHead className="w-[150px] text-[11px] uppercase tracking-wide text-muted-foreground font-semibold px-4 py-2">Role</TableHead>
              <TableHead className="w-[50px] px-4 py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-[13px]">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="group border-border hover:bg-secondary/50 transition-colors duration-150 relative"
                >
                  <TableCell className="px-4" onClick={() => onUserSelect?.(user)}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <UserCircle className="w-8 h-8 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-foreground">{user.username}</span>
                        <span className="text-[11px] text-muted-foreground">ID: {user.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[13px] px-4">
                    <div className="flex flex-col">
                      <span>{user.email}</span>
                      {user.phone && <span className="text-[11px]">{user.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-[10px] font-medium uppercase">
                      {user.role || 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-border">
                        <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEditRole?.(user)} className="text-[13px] cursor-pointer">
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteUser?.(user)} className="text-destructive text-[13px] cursor-pointer">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
