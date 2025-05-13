import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

interface UserProps {
  name: string;
  email: string;
}

const columns = [
  { name: 'NOMBRE', uid: 'name' },
  { name: 'CORREO', uid: 'email' },
  { name: 'ACCIONES', uid: 'actions' }
]

function App() {
  const [users, setUsers] = useState<[]>();

  const [hostIp, setHostIp] = useState<string>('');
  const [privateIp, setPrivateIp] = useState<string>('');
  const [publicIp, setPublicIp] = useState<string>('');

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const tunnelBaseUrl = import.meta.env.VITE_TUNNEL_BASE_URL;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{cellValue}</p>
          </div>
        );
      case "email":
        return (
          <div className='relative h-50 m-5 flex items-center justify-center'>
            <p>{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className='relative flex items-center justify-evenly'>
            <AiOutlineDelete size={25} color='#ff6961' className='cursor-pointer' />
            <AiOutlineEdit size={25} color='#ffd971' className='cursor-pointer' />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);


  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`${tunnelBaseUrl}/users`)
        const response = await res.json();
        setUsers(response);
      } catch {
        try {
          const res = await fetch(`http://${baseUrl}:5001/users`)
          const response = await res.json();
          setUsers(response);
        } catch (error) {
          console.log(error)
        }
      } finally {
        const privateIpRes = await fetch('/api/ip')
        const privateIp = await privateIpRes.json();
        setHostIp(privateIp.origin.host)
        setPrivateIp(privateIp.ip)

        const publicIpRes = await fetch('https://api.ipify.org?format=json')
        const publicIp = await publicIpRes.json();
        setPublicIp(publicIp.ip)

        setIsLoaded(true);
      }
    }

    getUsers();
  }, [baseUrl, tunnelBaseUrl])

  return (
    <div className='main-container'>
      {/* <div className='logo-container'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2>Vite + React</h2> */}
      <div className="header">
        <img src='/docker-mark-blue.svg'></img>
        <h1>Práctica Docker</h1>
      </div>
      <div className="table-container">
        <div className="table-wrapper">
          {users &&
            <Skeleton className='rounded-lg' isLoaded={isLoaded}>
              <Table
                aria-label='Users registered'
                isStriped
                isHeaderSticky
                fullWidth
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={users}>
                  {(item: UserProps) => (
                    <TableRow key={item.name}>
                      {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Skeleton>
          }
        </div>
      </div>
      <div className="footer">
        <Skeleton isLoaded={isLoaded}>
          <p>IP Docker: {privateIp}</p>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <p>IP Host: {hostIp.split(':')[0]}</p>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <p>IP Pública Cliente: {publicIp}</p>
        </Skeleton>
        <p className="read-the-docs">
          Stiven Pilca - Programación Distribuida
        </p>
      </div>
    </div>
  )
}

export default App
