import { useState } from "react";

import { AgGridReact } from "ag-grid-react";
import type { ColDef  } from 'node_modules/ag-grid-community/dist/types/core/main.d.ts';

import { classnames } from "@/common/utils/classnames";
import useQuerySummary from './useQuerySummary'

import styles from './summary.module.css';

 
const SummaryTable = () => {
  const summaryData = useQuerySummary()
   
  // @ts-ignore
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: 'username',
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressKeyboardEvent: () => true,
      suppressMovable: true,
      showRowGroup: true ,
    },
    {
      headerName: 'completed todos',
      field: 'title',
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      suppressKeyboardEvent: () => true,
      valueGetter: (p) => {
        return p.data.completed ? p.data.title : ''
      },
      cellRenderer: (p: any) => {
        return (
          <div>
            {p.value}
          </div>
      )}
    },

    {
      headerName: 'uncompleted todos',
      field: 'title',
      cellStyle: {
        display: 'flex',
        alignItems: 'center'
      },
      suppressMovable: true,
      suppressKeyboardEvent: () => true,
      valueGetter: (p) => {
        return !p.data.completed ? p.data.title : ''
      },
      cellRenderer: (p: any) => {
        return (
          <div>
            {p.value}
          </div>
      )}
    },
    
  ])
  
  return (
    <>
      <div className={classnames([styles.table, 'ag-theme-quartz'])}>
        <AgGridReact
          rowData={summaryData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          rowHeight={80}
          groupDisplayType={'groupRows'}
        />
      </div>
    </>
  )
}

export default SummaryTable;