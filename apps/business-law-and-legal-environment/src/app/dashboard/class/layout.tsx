export default function (props: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<>
			{props.modal}
			{props.children}
		</>
	);
}
