import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@itell/ui/skeleton";
import { User } from "lucia";

export const Profile = ({ user }: { user: User }) => {
	return (
		<div className="space-y-4">
			<h3 className="mb-4 text-lg font-medium">Profile</h3>
			<div className="space-y-2">
				<p className="font-medium flex items-center gap-2">
					<UserAvatar name={user.name} image={user.image} />
					{user.name}
				</p>
				<p className="text-muted-foreground text-sm">{user.email}</p>
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
