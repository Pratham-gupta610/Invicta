import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Profile } from '@/types/types';
import { getUserDisplayName } from '@/lib/utils';

interface DeleteUserModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteUserModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  const displayName = getUserDisplayName(user.full_name, user.email, user.id);
  const isAdmin = user.role === 'admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Delete User</DialogTitle>
          <DialogDescription className="text-center text-base space-y-4">
            <p className="text-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{displayName}</span>
              {user.email && user.email !== displayName && (
                <span className="block text-sm text-muted-foreground mt-1">
                  ({user.email})
                </span>
              )}
              ?
            </p>

            {isAdmin && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-semibold text-destructive">
                  ⚠️ Warning: This is an admin user
                </p>
              </div>
            )}
            
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <p className="font-medium text-foreground text-sm">This action will:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Remove user from the database</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Delete all user registrations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Remove user from all teams</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Delete user profile data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span className="font-semibold text-destructive">Cannot be undone</span>
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete User'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
