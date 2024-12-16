export function DelayMessage() {
  return (
    <p className="text-sm text-muted-foreground" role="status">
      The request is taking longer than usual, if this keeps loading without a
      response, please try refreshing the page. If the problem persists, please
      report to lear.lab.vu@gmail.com.
    </p>
  );
}
