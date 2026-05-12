import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import type { Task } from "../../types/task"
import { TaskCard } from "./TaskCard"

type SortableTaskItemProps = {
    task: Task
    isEditing: boolean
    editingTitle: string
    onEditingTitleChange: (value: string) => void
    onStartEdit: (task: Task) => void
    onSaveEdit: (id: string) => void
    onCancelEdit: () => void
    onToggle: (id: string) => void
    onDelete: (id: string) => void
    disabled?: boolean
}

export function SortableTaskItem({
    task,
    isEditing,
    editingTitle,
    onEditingTitleChange,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onToggle,
    onDelete,
    disabled = false,
}: SortableTaskItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        disabled,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={isDragging ? "relative z-50 opacity-60" : ""}
        >
            <TaskCard
                task={task}
                isEditing={isEditing}
                editingTitle={editingTitle}
                onEditingTitleChange={onEditingTitleChange}
                onStartEdit={onStartEdit}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onToggle={onToggle}
                onDelete={onDelete}
                isDragDisabled={disabled}
            />
        </div>
    )
}