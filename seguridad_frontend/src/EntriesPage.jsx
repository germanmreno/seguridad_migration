import { DataTable } from './visits/data-table'
import { columns } from './visits/columns'
import { Layout } from './layout'
import { useState } from 'react'

export const EntriesPage = ({ user }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full">
          <div className="h-12 flex items-center p-4">
            <h1 className="primary-text p-0 m-0">
              REGISTRO DE VISITANTES DEL EDIFICIO PAWA
            </h1>
          </div>
        </div>
        <DataTable columns={columns} user={user} key={refreshTrigger} />
      </div>
    </Layout>
  )
}
