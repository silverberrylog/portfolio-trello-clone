import { RootState } from '@/store'
import { addTask, update } from '@/store/project'
import { Task } from '@/types'
import { fixFocus } from '@/utils/misc'
import { DotsVerticalIcon } from '@heroicons/react/solid'
import { FormEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const resizeTextArea = (event: FormEventHandler<HTMLTextAreaElement>) => {
    event.target.style.height = event.target.scrollHeight + 'px'
    // event.target.style.height = 'auto'
}

interface TaskComponentProps {
    task: Task
}

export default function TaskComponent(props: TaskComponentProps) {
    const selectedTaskId = useSelector(
        (state: RootState) => state.project.selectedTaskId
    )
    const selectedTaskName = useSelector(
        (state: RootState) => state.project.selectedTaskName
    )
    const dispatch = useDispatch()

    return (
        <div key={props.task.id} className="relative">
            <textarea
                value={
                    props.task.id == selectedTaskId
                        ? selectedTaskName
                        : props.task.name
                }
                className="task-base resize-none ghost-input py-20"
                placeholder="Task title"
                onInput={resizeTextArea}
                onChange={event =>
                    dispatch(
                        update({
                            selectedTaskName: event.target.value,
                        })
                    )
                }
                id={`task-${props.task.id}`}
                disabled={props.task.id != selectedTaskId}
                onBlur={() =>
                    dispatch(
                        addTask({
                            name: selectedTaskName,
                            list: props.list.id,
                            project: props.list.project,
                            createdAt: Date.now(),
                        })
                    )
                }
                onFocus={fixFocus}
                autoFocus></textarea>
            <DotsVerticalIcon
                onClick={event => {
                    const boundingRect =
                        event.currentTarget.getBoundingClientRect()

                    // 12= top-12, right-12
                    dispatch(
                        update({
                            showFloatingMenu: true,
                            floatingMenuX:
                                boundingRect.x + boundingRect.width + 2 * 12,
                            floatingMenuY: boundingRect.y - 12,
                        })
                    )
                }}
                className="absolute top-12 right-12 w-32 h-32 button-icon"
            />
            <div className="floating-menu hidden">
                <button className="button-primary">Save</button>
                <button className="button-primary">Delete</button>
            </div>
        </div>
    )
}