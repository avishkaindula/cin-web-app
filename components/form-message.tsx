export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      {"success" in message && (
        <div className="bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 rounded-md p-3">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-md p-3">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 rounded-md p-3">
          {message.message}
        </div>
      )}
    </div>
  );
}
