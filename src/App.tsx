import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/table";
import { Skeleton } from "@heroui/skeleton";
import { useDisclosure } from "@heroui/modal"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import ModalDelete from './components/ModalDelete';
import ModalUpdate from './components/ModalUpdate';

interface UserProps {
  id?: number;
  name: string;
  email: string;
}

const columns = [
  { name: 'NOMBRE', uid: 'name' },
  { name: 'CORREO', uid: 'email' },
  { name: 'ACCIONES', uid: 'actions' }
]



function App() {
  const [users, setUsers] = useState<never[] | [] | UserProps[]>([]);
  const [selectedUser, setSelectecUser] = useState<UserProps>();

  const [hostIp, setHostIp] = useState<string>('');
  // const [privateIp, setPrivateIp] = useState<string>('');
  const [publicIp, setPublicIp] = useState<string>('');

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const {
    isOpen: isModalDeleteOpen,
    onOpen: onModalDeleteOpen,
    onClose: onModalDeleteClose
  } = useDisclosure();

  const {
    isOpen: isModalUpdateOpen,
    onOpen: onModalUpdateOpen,
    onClose: onModalUpdateClose
  } = useDisclosure();

  const readBaseUrl = import.meta.env.VITE_R_BASE_URL;
  const operationBaseUrl = import.meta.env.VITE_CUD_BASE_URL;
  const ipBaseUrl = import.meta.env.VITE_IP_BASE_URL;

  const renderCell = useCallback((user: UserProps, columnKey: React.Key) => {
    // @ts-expect-error column key
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <div className='relative h-1 m-1 flex items-center justify-center'>
            <p>{cellValue}</p>
          </div>
        );
      case "email":
        return (
          <div className='relative h-1 m-1 flex items-center justify-center'>
            <p>{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className='relative flex items-center justify-evenly'>
            <AiOutlineDelete
              size={20}
              color='#ff6961'
              className='cursor-pointer'
              onClick={() => {
                setSelectecUser(user);
                onModalDeleteOpen();
              }} />
            <AiOutlineEdit
              size={20}
              color='#ffd971'
              className='cursor-pointer'
              onClick={() => {
                setSelectecUser(user);
                onModalUpdateOpen();
              }}
            />
          </div>
        );
      default:
        return cellValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const protocol = operationBaseUrl.slice(0, 5);
      const res = protocol !== 'https'
        ? await fetch(`http://${operationBaseUrl}:5000/users/${id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
        })
        : await fetch(`${operationBaseUrl}/users/${id}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
        })

      setUsers((prevUsers: [] | UserProps[]) => prevUsers?.filter((user: UserProps) => user?.id !== id));

      console.log('Successfully delete user', res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (id: number, data: string) => {
    try {
      const protocol = readBaseUrl.slice(0, 5);
      const res = protocol !== 'https'
        ? await fetch(`http://${operationBaseUrl}:5000/users/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "name": data
          })
        })
        : await fetch(`${operationBaseUrl}/users/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "name": data
          })
        })
      const response = await res.json();
      console.log(response);

      setUsers((prevUsers: [] | UserProps[]) =>
        prevUsers.map((user: UserProps) =>
          user.id === id ? { ...user, name: data } : user)
      );
      console.log('Successfully update user', res)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const protocol = readBaseUrl.slice(0, 5);
        const res = protocol !== 'https'
          ? await fetch(`http://${readBaseUrl}:5001/users`)
          : await fetch(`${readBaseUrl}/users`)
        const response = await res.json();
        setUsers(response);
      } catch (error) {
        console.log(error)
      } finally {
        try {
          const protocol = ipBaseUrl.slice(0, 5);
          const hostIpRes = protocol !== 'https'
            ? await fetch(`http://${ipBaseUrl}:3000/ip`)
            : await fetch(`${ipBaseUrl}/ip`)
          const hostIp = await hostIpRes.json();
          setHostIp(hostIp.ip)

          const publicIpRes = await fetch('https://api.ipify.org?format=json')
          const publicIp = await publicIpRes.json();
          setPublicIp(publicIp.ip)

          setIsLoaded(true);
        } catch (error) {
          setIsLoaded(true);
          console.log(error)
        }
      }
    }

    getUsers();
  }, [ipBaseUrl, readBaseUrl])

  return (
    <div className='main-container'>
      <div className="header">
        <img src='/docker-mark-blue.svg'></img>
        <h1>Práctica Docker</h1>
      </div>
      <div className="table-container">

        {users &&
          <div className="table-wrapper">
            <Skeleton className='relative rounded-lg dark:bg-neutral-800' isLoaded={isLoaded} >
              <Table
                aria-label='Users registered'
                isHeaderSticky
                shadow='none'
                radius='sm'
                classNames={
                  {
                    table: 'table',
                    thead: 'tableThead',
                    th: 'tableTh',
                    tr: 'tableTr',
                    td: 'tableTd'
                  }
                }
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
                    <TableRow key={item.id}>
                      {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Skeleton>
          </div>
        }
      </div>
      <div className="footer">
        <Skeleton isLoaded={isLoaded} className='rounded-lg px-2 dark:bg-neutral-800'>
          <p>IP Pública servicio: {hostIp}</p>
        </Skeleton>
        <Skeleton isLoaded={isLoaded} className='rounded-lg px-2 dark:bg-neutral-800'>
          <p>IP Pública Cliente: {publicIp}</p>
        </Skeleton>
        <p className="read-the-docs">
          Stiven Pilca - Programación Distribuida
        </p>
      </div>
      <ModalDelete
        isOpen={isModalDeleteOpen}
        onClose={onModalDeleteClose}
        userData={selectedUser}
        handleDelete={handleDelete}
      />
      <ModalUpdate
        isOpen={isModalUpdateOpen}
        onClose={onModalUpdateClose}
        userData={selectedUser}
        handleUpdate={handleUpdate}
      />
    </div>
  )
}

export default App
