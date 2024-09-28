import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@itell/ui/skeleton";
import { type User } from "lucia";

export function Profile({ user }: { user: User }) {
  return (
    <div className="space-y-4">
      <h3 className="mb-4 text-lg font-medium">Profile</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserAvatar user={user} />
          <p className="font-semibold leading-none">{user.name}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="sr-only">user's email</span>
          {user.email}
        </p>
      </div>
    </div>
  );
}

Profile.Skeleton = function () {
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold leading-relaxed">Profile</h3>
      <Skeleton className="h-8 w-[120px]" />
      <Skeleton className="h-16 w-[400px]" />
    </>
  );
};
