import React, { useCallback, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Issue, IssueStatus } from "../types";
import { KanbanCard } from "./kanban-card";
import { KanbanColumnHeader } from "./kanban-column-header";

const boards: IssueStatus[] = [
  IssueStatus.BACKLOG,
  IssueStatus.TODO,
  IssueStatus.IN_PROGRESS,
  IssueStatus.IN_REVIEW,
  IssueStatus.DONE,
];

type IssueState = {
  [key in IssueStatus]: Issue[];
};
interface DataKanbanProps {
  data: Issue[];
  onChange: (
    tasks: {
      $id: string;
      status: IssueStatus;
      position: number;
    }[],
  ) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = React.useState<IssueState>(() => {
    const initialTasks: IssueState = {
      [IssueStatus.BACKLOG]: [],
      [IssueStatus.TODO]: [],
      [IssueStatus.IN_PROGRESS]: [],
      [IssueStatus.IN_REVIEW]: [],
      [IssueStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((key) => {
      initialTasks[key as IssueStatus].sort((a, b) => a.position - b.position);
    });

    return initialTasks;
  });

  useEffect(() => {
    const newTasks: IssueState = {
      [IssueStatus.BACKLOG]: [],
      [IssueStatus.TODO]: [],
      [IssueStatus.IN_PROGRESS]: [],
      [IssueStatus.IN_REVIEW]: [],
      [IssueStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((key) => {
      newTasks[key as IssueStatus].sort((a, b) => a.position - b.position);
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const sourceStatus = source.droppableId as IssueStatus;
      const destinationStatus = destination.droppableId as IssueStatus;

      let updatesPayload: {
        $id: string;
        status: IssueStatus;
        position: number;
      }[] = [];

      setTasks((prev) => {
        const newTasks = { ...prev };
        // Safely remove task from source column
        const sourceTasks = [...newTasks[sourceStatus]];
        const [movedTask] = sourceTasks.splice(source.index, 1);

        // If there is no moved task, return the previous state
        if (!movedTask) {
          console.error("No task found in source index");
          return prev;
        }

        // Create a new task object with potentiallu updated status
        const updatedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        // Updating the source column
        newTasks[sourceStatus] = sourceTasks;

        // Add the updated task to the destination column
        const destinationColumn = [...newTasks[destinationStatus]];
        destinationColumn.splice(destination.index, 0, updatedTask);
        newTasks[destinationStatus] = destinationColumn;

        // Prepare minimal update payload
        updatesPayload = [];

        // Always update the the moved task
        updatesPayload.push({
          $id: movedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        // Update the positions for affected tasks in the destination column
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        // If  the task moved between columns, update position in the soure column
        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTasks;
      });
      onChange(updatesPayload);
    },
    [onChange],
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted-foreground/20 p-1.5"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable key={board} droppableId={board}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-[200px] py-1.5"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <KanbanCard issue={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
