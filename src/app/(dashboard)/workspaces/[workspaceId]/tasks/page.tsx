import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/issues/components/task-view-switcher";
import { redirect } from "next/navigation";

const TasksPage = async () => {
  const current = await getCurrent();
  if (!current) redirect("/sign-in");

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
