import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { AgGridReact } from "ag-grid-react";
import type { ColDef  } from 'node_modules/ag-grid-community/dist/types/core/main.d.ts';

import { useAuthContext } from "@/common/contexts/auth";
import { Todo } from "@/common/types";
import { classnames } from "@/common/utils/classnames";
import {useQueryTodos} from './api'
import TodoItem from './TodoItem';
import { useUpdateTodoMutation, useDeleteTodoMutation} from './api'

import CreateTodoForm from './CreateTodoForm';
import styles from './todos.module.css';

const TodoSchema = z.object({
  theForm: z.object({
    completed: z.boolean(),
    title: z
      .string()
      .min(5)
      .max(120)
    }).array()
  })

type TodoSchemaType = z.infer<typeof TodoSchema>;



const TodosList = () => {
  const {currentUser} = useAuthContext()
  const {todos, isLoading} = useQueryTodos(currentUser?.id)

  const { 
    register, 
    handleSubmit, 
    control,
    trigger,
    reset,
    getValues,
    formState: {
      errors,
      isValid
    } 
  } = useForm<TodoSchemaType>({
      resolver: zodResolver(TodoSchema),
      shouldUnregister: true,
      values: {
        theForm: todos!
      }
    });

  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: 'completed',
      flex: 2,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      cellRenderer: (p) => {
        console.log('p.node.rowIndex', p.node.rowIndex)
        return (
        <input
          key={p.node.rowIndex}
          className={styles['checkbox']}
          type='checkbox'
          // defaultChecked={p.data.completed}
          {...register(`theForm.${p.node.rowIndex}.completed`)}
          onChange={({ target: { checked }})  => {
            p.setValue(checked)
          }}
        />
      )}
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
            key={p.node.rowIndex}

            // key={fields[p.node.rowIndex].id}
            className={styles['text-input']}
            // defaultValue={p.data.title}
            // onChange={({ target: { value }})  => {
            //   p.setValue(value)
            // }}
            // {...register('title')}
            {...register(`theForm.${p.node.rowIndex}.title`)}
            onChange={({ target: { value }}) => {
              p.setValue(value)
            }}
          />
          {errors.theForm && <div>{errors.theForm![p.node.rowIndex]?.title?.message}</div>}
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
        const updateTodoMutation = useUpdateTodoMutation()

        const onSubmit = () => {
          console.log('submut')
          updateTodoMutation.mutate({
            userId: currentUser!.id,
            todoId: p.data.id,
            completed: p.data.completed,
            title: p.data.title
          })
        };

        return (
          <div className={styles['actions-wrapper']}>
            <button
              className={styles['update-button']}
              disabled={updateTodoMutation.isPending}
              type="button"
              onClick={handleSubmit(onSubmit)}
              // onClick={() => {
              //   console.log('p', p)
              //   console.log(JSON.stringify(p.data))

              //   updateTodoMutation.mutate({
              //     userId: currentUser!.id,
              //     todoId: p.data.id,
              //     completed: p.data.completed,
              //     title: p.data.title
              //   })

              // }}
              // onClick={handleSubmit(onSubmit)}
            >
              {updateTodoMutation.isPending ? 'wait...' : 'Update'} 
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


  console.log('isLoading!!!', isLoading)
  console.log('errors!!!', errors)


  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  console.log('getValues', getValues())


  return (
    <>
      <CreateTodoForm />
      {errors.theForm && errors.theForm![0]?.title?.message}

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