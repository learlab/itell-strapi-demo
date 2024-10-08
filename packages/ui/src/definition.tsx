export function Definition({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="definition">
      <div className="text-base font-semibold leading-relaxed">{text}</div>
      <div className="pl-4 font-light leading-relaxed lg:pl-6">{children}</div>
    </div>
  );
}
