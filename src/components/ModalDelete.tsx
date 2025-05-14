import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@heroui/table";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/modal"
import { Button } from "@heroui/button";

interface ModalDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserProps | undefined;
    handleDelete: (id: number) => void;
}

interface UserProps {
  id?: number;
  name: string;
  email: string;
}

export default function ModalDelete({ isOpen, onClose, userData, handleDelete }: ModalDeleteProps) {
    return (
        <Modal
            backdrop='blur'
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Eliminar Usuario</ModalHeader>
                        <ModalBody className='text-sm'>
                            <p>
                                Está seguro que desea eliminar al usuario:
                            </p>
                            <Table
                                aria-label='user-selected-information'
                                shadow='none'
                            >
                                <TableHeader>
                                    <TableColumn key="0">Nombre</TableColumn>
                                    <TableColumn key="1">Correo</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="0" className='text-center'>
                                        <TableCell>{userData?.name}</TableCell>
                                        <TableCell>{userData?.email}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="ghost"
                                onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                variant='solid'
                                className='dark:bg-red-500 font-medium'
                                onPress={() => {
                                    onClose();
                                    handleDelete(userData?.id || 0);
                                }}>
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}