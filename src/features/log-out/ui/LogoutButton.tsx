'use client';

import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

import { useLogout } from '../model/useLogout';

import s from './logout-button.module.scss';
import { LogOutIcon } from './LogOutIcon';

const LOGOUT_MODAL_WIDTH = 438;

type Props = {
    userEmail: string;
};
export const LogoutButton = ({ userEmail }: Props): React.JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutate: logout, isPending, error, reset } = useLogout();
    // Достаю ошибку и reset. Reset для того чтобы очистить мутацию, так как после ошибки она харнится в кэше

    const handleClose = (): void => {
        setIsModalOpen(false);
        reset();
    };

    return (
        <>
            <button
                className={s['logout-btn']}
                type="button"
                onClick={() => setIsModalOpen(true)}
            >
                <LogOutIcon width={24} height={24} />
                Log out
            </button>

            <Modal
                open={isModalOpen}
                onClose={handleClose}
                title="Log Out"
                width={LOGOUT_MODAL_WIDTH}
                actions={
                    <>
                        <Button
                            variant="outlined"
                            onClick={() => logout()}
                            disabled={isPending}
                        >
                            Yes
                        </Button>
                        <Button onClick={handleClose} disabled={isPending}>
                            No
                        </Button>
                    </>
                }
            >
                <p>
                    Do you really want to log out of your account &quot;
                    <strong>{userEmail}</strong>&quot;?
                </p>
                {error && <p className={s.error}>{error.message}</p>}
            </Modal>
        </>
    );
};
