import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@itell/ui/server";
import { User } from "lucia";

export const Profile = ({ user }: { user: User }) => {
	return (
		<div className="space-y-4">
			<h3 className="mb-4 text-lg font-medium">Profile</h3>
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<UserAvatar user={user} />
					<p className="leading-none font-semibold">{user.name}</p>
				</div>
				<p className="text-muted-foreground text-sm">
					<span className="sr-only">user's email</span>
					{user.email}
				</p>
			</div>
		</div>
	);
};

Profile.Skeleton = () => (
	<>
		<h3 className="mb-4 font-semibold text-lg leading-relaxed">Profile</h3>
		<Skeleton className="h-8 w-[120px]" />
		<Skeleton className="h-16 w-[400px]" />
	</>
);
