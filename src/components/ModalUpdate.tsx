import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/modal"
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";

interface ModalUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserProps | undefined;
    handleUpdate: (id: number, data: string) => void;
}

interface UserProps {
    id?: number;
    name: string;
    email: string;
}

export default function ModalUpdate({ isOpen, onClose, userData, handleUpdate }: ModalUpdateProps) {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        const init = () => {
            setName(userData?.name || '');
            setEmail(userData?.email || '');
        }

        init();
    }, [userData, isOpen])

    return (
        <Modal
            backdrop='blur'
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Actualizar Usuario</ModalHeader>
                        <ModalBody className='text-sm'>
                            <p>
                                Actualizar los campos del usuario:
                            </p>
                            <Input
                                isClearable
                                isRequired
                                variant="bordered"
                                type="text"
                                label="Nombre"
                                placeholder="Ingresa un nombre"
                                value={name}
                                onValueChange={setName}
                            />
                            <Input
                                disabled
                                variant="faded"
                                type="email"
                                label="Correo"
                                value={email}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="ghost" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                variant='solid'
                                className='dark:bg-yellow-600 font-medium'
                                onPress={() => {
                                    onClose();
                                    handleUpdate(userData?.id || 0, name);
                                }}>
                                Actualizar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}