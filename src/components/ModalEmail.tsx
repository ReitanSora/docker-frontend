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

interface ModalEditProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserProps | undefined;
    handleSendEmail: (subject: string, content: string) => void;
}

interface UserProps {
    id?: number;
    name: string;
    email: string;
}

export default function ModalEmail({ isOpen, onClose, userData, handleSendEmail }: ModalEditProps) {
    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [content, setContent] = useState<string>('')

    useEffect(() => {
        const init = () => {
            setSubject('');
            setContent('');
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
                        <ModalHeader className="flex flex-col gap-1">Enviar correo</ModalHeader>
                        <ModalBody className='text-sm'>
                            <p>
                                Enviar un correo al usuario:
                            </p>
                            <Input
                                disabled
                                variant="faded"
                                type="email"
                                label="Para"
                                value={email}
                            />
                            <Input
                                isClearable
                                isRequired
                                variant="bordered"
                                type="text"
                                label="Asunto"
                                value={subject}
                                onValueChange={setSubject}
                            />
                            <Input
                                isClearable
                                isRequired
                                variant="bordered"
                                type="text"
                                size="lg"
                                label="Mensaje"
                                value={content}
                                onValueChange={setContent}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="ghost" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                variant='solid'
                                className='dark:bg-blue-700 font-medium'
                                onPress={() => {
                                    onClose();
                                    handleSendEmail(subject, content);
                                }}>
                                Enviar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
};
