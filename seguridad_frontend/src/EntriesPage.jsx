import { DataTable } from './visits/data-table'
import { columns } from './visits/columns'
import { Layout } from './layout'

export const EntriesPage = ({ user }) => {

  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4" >
          <h1 className="primary-text p-0 m-0">REGISTRO DE VISITANTES DE LA CORPORACIÓN VENEZOLANA DE MINERÍA</h1>
        </div>
        <DataTable columns={columns} user={user} />
      </div>
    </Layout>
  )
}
