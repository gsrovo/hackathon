export function zodFirstIssueMessage(error: {
  issues: ReadonlyArray<{ message: string }>;
}): string {
  return error.issues[0]?.message ?? 'Validation error';
}
