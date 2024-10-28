import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef  } from 'node_modules/ag-grid-community/dist/types/core/main.d.ts';

import { useAuthContext } from "@/common/contexts/auth";
import { Todo } from "@/common/types";
import { classnames } from "@/common/utils/classnames";
import {useQueryTodos} from './api'
import TodoItem from './TodoItem';
import CreateTodoForm from './CreateTodoForm';
import styles from './todos.module.css';

import { useUpdateTodoMutation, useDeleteTodoMutation} from './api'

const TodosList = () => {
  const {currentUser} = useAuthContext()
  const {todos, isLoading} = useQueryTodos(currentUser?.id)
  // const deleteTodoMutation = useDeleteTodoMutation()

  console.log('todos!!!', todos)

  // const onDeleteTodo = (todoId: Todo['id']) => {
  //   deleteTodoMutation.mutate({
  //     userId: currentUser!.id,
  //     todoId,
  //   })
  // }

  // TODO maybe wrong here
  // const [todosCopy, setTodosCopy] = useState(todos || [])



  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: 'completed',
      flex: 2,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      cellRenderer: (p) => (
        <input
          className={styles['checkbox']}
          type='checkbox'
          defaultChecked={p.data.completed}
          onChange={({ target: { checked }})  => {
            p.setValue(checked)
          }}
          // {...register("completed")}
        />
      )
    },
    {
      field: 'title',
      flex: 6,
      suppressMovable: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      cellRenderer: (p) => (
        <div>
          <input
            className={styles['text-input']}
            defaultValue={p.data.title}
            onChange={({ target: { value }})  => {
              p.setValue(value)
            }}
            // {...register("title")}
          />
          {/* {errors.title && <div>{errors.title.message}</div>} */}
        </div>
      )
    },
    {
      flex: 4,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      cellRenderer: (p) => {
        // doesnot react correctly if declared at the top 
        const deleteTodoMutation = useDeleteTodoMutation()

        return (
          <div className={styles['actions-wrapper']}>
            <button
              className={styles['update-button']}
              // disabled={updateTodoMutation.isPending}
              type="button"
              onClick={() => {
                console.log('p', p)
                console.log(JSON.stringify(p.data))

                // this.grid.api.getRowNode(id).data
              }}
              // onClick={handleSubmit(onSubmit)}
            >
              update
              {/* {updateTodoMutation.isPending ? 'wait...' : 'Update'}  */}
            </button>

            <button
              className={styles['update-button']}
              disabled={deleteTodoMutation.isPending}
              onClick={() => {
                deleteTodoMutation.mutate({
                  userId: currentUser!.id,
                  todoId: p.data.id,
                })
              }}
              type="button"
            >
              {deleteTodoMutation.isPending ? 'wait...' : 'Delete'} 
            </button>
          </div>
        )
      }

    },
  ])

  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  // console.log('todosCopy', todosCopy)

  return (
    <>
      <CreateTodoForm />

      <div className={classnames([styles['todos-wrapper'], 'ag-theme-quartz'])}>
        <AgGridReact
          rowData={todos}
          columnDefs={colDefs}
          rowHeight={80}
          getRowId={params => params.data.id.toString()}
        />
      </div>
    </>

  )
}

export default TodosList;