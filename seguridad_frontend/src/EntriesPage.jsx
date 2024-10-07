import { DataTable } from './entries/data-table'
import { columns } from './entries/columns'
import { Layout } from './layout'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Export the data separately
const tableData = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // New entries
  {
    id: "23a7b9c1",
    amount: 75,
    status: "success",
    email: "john.doe@example.com",
  },
  {
    id: "56f4e2d8",
    amount: 200,
    status: "failed",
    email: "jane.smith@gmail.com",
  },
  {
    id: "91c3b7a5",
    amount: 150,
    status: "pending",
    email: "alex.johnson@example.com",
  },
  {
    id: "37d8e6f2",
    amount: 80,
    status: "success",
    email: "sarah.brown@gmail.com",
  },
  {
    id: "82g5h9j4",
    amount: 175,
    status: "processing",
    email: "michael.wilson@example.com",
  },
  {
    id: "19k2l7m3",
    amount: 90,
    status: "pending",
    email: "emily.taylor@gmail.com",
  },
  {
    id: "64n8p5q1",
    amount: 225,
    status: "success",
    email: "david.anderson@example.com",
  },
  {
    id: "73r6s9t2",
    amount: 110,
    status: "failed",
    email: "olivia.martinez@gmail.com",
  },
]

export const EntriesPage = () => {

  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  const getEntries = async () => {
    const res = await axios.get('http://localhost:8000/api/data');

    console.log(res);

    if (res.statusText === 'OK') setEntries(res.data);

    return;
  };

  useEffect(() => {
    getEntries();
  }, []);

  console.log(entries);

  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // State

  return (
    <Layout >

      <div className="container mx-auto py-10 grid grid-rows-1 divide-y">
        <div className="bg-[#24387d] text-white rounded-t-lg w-full h-12 flex items-center justify-start p-0 border-solid border-gray border-2 pl-4" >
          <h1 className="primary-text p-0 m-0">REGISTRO DE RECEPCIÓN DE LA CORPORACIÓN VENEZOLANA DE MINERÍA</h1>
        </div>
        <DataTable columns={columns({ navigate, toast, setRefresh })} data={entries} />
      </div>
    </Layout>
  )
}
