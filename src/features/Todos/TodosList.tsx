import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { AgGridReact } from "ag-grid-react";
import type { ColDef  } from 'node_modules/ag-grid-community/dist/types/core/main.d.ts';

import { useAuthContext } from "@/common/contexts/auth";
import { Todo } from "@/common/types";
import { classnames } from "@/common/utils/classnames";
import {useQueryTodos} from './api'
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
  const [todosCopy, setTodosCopy] = useState<Todo[]>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (todos && !todosCopy) {
      setTodosCopy(todos.map(i => JSON.parse(JSON.stringify(i))))
    }
  }, [todos])

  const { 
    register, 
    handleSubmit, 
    getValues,
    formState: {
      errors,
    } 
  } = useForm<TodoSchemaType>({
      resolver: zodResolver(TodoSchema),
      values: {
        theForm: todosCopy!
      },
      defaultValues: {
        theForm: todosCopy!
      }
    });

  const errorRef = useRef<any>()
  errorRef.current = errors

  const valuesRef = useRef<any>()
  valuesRef.current = todosCopy

  console.log('TOP VALUES', getValues())

  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: 'completed',
      cellDataType: 'boolean',
      flex: 2,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressKeyboardEvent: () => true,
      suppressMovable: true,
      cellRendererParams: {
        formErrors: () => errorRef.current,
        formValues: () => valuesRef.current
      },
      cellRenderer: (p) => {
        const currentValue = p.formValues()[p.node.rowIndex]
        const {onChange, ...rest} = register(`theForm.${p.node.rowIndex}.completed`);

        return (
          <input
            key={p.node.rowIndex}
            className={styles['checkbox']}
            type='checkbox'
            defaultChecked={currentValue && currentValue.completed}
            {...rest}
            onChange={(event) => {
              onChange(event)
              p.setValue(event.target.checked)
            }}
          />
        )
    }
    },
    {
      field: 'title',
      flex: 6,
      suppressMovable: true,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressKeyboardEvent: () => true,

      cellRendererParams: {
        formErrors: () => errorRef.current,
        formValues: () => valuesRef.current
      },
      cellRenderer: (p) => {
        const currentValue = p.formValues()[p.node.rowIndex]
        // console.log('currentValue', currentValue)

        const {onChange, ...rest} = register(`theForm.${p.node.rowIndex}.title`);

        return (
          <div>
            <input
              key={p.node.rowIndex}
              defaultValue={currentValue && currentValue.title}
              className={styles['text-input']}
              {...rest}
              onChange={(event) => {
                onChange(event)
                p.setValue(event.target.value)
                console.log('change ref', errorRef)
                // const thisRow = p.api.getDisplayedRowAtIndex(p.node.rowIndex)
                // p.api.redrawRows({ rowNodes: [thisRow] })
              }}
            />
            {p.formErrors().theForm && <div className={styles['error-text']}>{p.formErrors().theForm![p.node.rowIndex]?.title?.message}</div>}
          </div>
      )}
    },
    {
      flex: 4,
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      suppressKeyboardEvent: () => true,

      sortable: false,
      cellRendererParams: {
        // forErrors: errors,
        formErrors: () => errorRef.current,
        formValues: () => valuesRef.current
      },
      
      cellRenderer: (p) => {
        const deleteTodoMutation = useDeleteTodoMutation()
        const updateTodoMutation = useUpdateTodoMutation()

        const onSubmit = () => {
          updateTodoMutation.mutate({
            userId: currentUser!.id,
            todoId: p.data.id,
            completed: p.data.completed,
            title: p.data.title
          }, {
            onSuccess: () => {
              // errorRef.current = {}
              // reset()
              const thisRow = p.api.getDisplayedRowAtIndex(p.node.rowIndex)
              p.api.redrawRows({ rowNodes: [thisRow] })
            }
          })
        };

        return (
          <div className={styles['actions-wrapper']}>
            <button
              className={styles['update-button']}
              disabled={updateTodoMutation.isPending}
              type="button"
              onClick={() => {
                const submitFunc = handleSubmit(onSubmit, (...par) => {
                  console.log('par', par)
                  errorRef.current = par[0]

                  const thisRow = p.api.getDisplayedRowAtIndex(p.node.rowIndex)
                  p.api.redrawRows({ rowNodes: [thisRow] })
                });
                
                submitFunc()
              }}
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

  if (isLoading) {
    return (
      <div>loading, please wait...</div>
    )
  }

  console.log('errors!!!', errors)

  return (
    <>
      <CreateTodoForm />

      <div className={classnames([styles['todos-wrapper'], 'ag-theme-quartz'])}>
        <AgGridReact
          rowData={todosCopy}
          columnDefs={colDefs}
          rowHeight={80}
          getRowId={params => params.data.id.toString()}
        />
      </div>
    </>

  )
}

export default TodosList;