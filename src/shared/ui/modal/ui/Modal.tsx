'use client';

import { useEffect, useId, useRef } from 'react';

import { CloseIcon } from './CloseIcon';
import css from './modal.module.scss';

const DEFAULT_WIDTH = 378;

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: number;
    closeOnOverlayClick?: boolean;
    headerLeft?: React.ReactNode; // слева в шапке, например стрелка «назад»
    headerRight?: React.ReactNode; // справа в шапке вместо крестика, например кнопка Next
    noPadding?: boolean; // тело без отступов: фото прилегает к краям окна
    actions?: React.ReactNode; // кнопки внизу окна (OK, Yes / No)
    actionsAlign?: 'end' | 'between'; // кнопки справа или по краям
    closeOutside?: boolean; // крестик снаружи окна, в правом верхнем углу экрана
    children: React.ReactNode;
};

export const Modal = ({
    open,
    onClose,
    title,
    width = DEFAULT_WIDTH,
    closeOnOverlayClick = true,
    headerLeft,
    headerRight,
    noPadding = false,
    actions,
    actionsAlign = 'end',
    closeOutside = false,
    children,
}: ModalProps): React.JSX.Element => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    // Открываем и закрываем <dialog> вслед за пропом open
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        }

        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    // Сама модалка никогда не закрывается — она только сообщает родителю через onClose,
    // что пользователь хочет её закрыть. Закрывает родитель, поставив open={false}.
    // Так родитель может, например, сначала спросить «Точно закрыть?».

    // Esc: не даём браузеру закрыть окно самому и спрашиваем родителя
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>): void => {
        if (event.key === 'Escape') {
            event.preventDefault();
            onClose();
        }
    };

    // Запасной вариант: другие способы «закрыть» окно (например, кнопка «Назад» на Android)
    const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>): void => {
        event.preventDefault();
        onClose();
    };

    // Клик по затемнённому фону приходит на сам <dialog>, клик по окну — на его содержимое
    const handleClick = (event: React.MouseEvent<HTMLDialogElement>): void => {
        const clickedOnOverlay = event.target === event.currentTarget;

        if (closeOnOverlayClick && clickedOnOverlay) {
            onClose();
        }
    };

    // Своя шапка: если передан headerLeft или headerRight,
    // заголовок встаёт по центру, а справа вместо крестика — headerRight
    const hasCustomHeader = Boolean(headerLeft || headerRight);

    const headerClass = [css.header, hasCustomHeader && css['header-centered']]
        .filter(Boolean)
        .join(' ');

    const bodyClass = [css.body, noPadding && css['no-padding']]
        .filter(Boolean)
        .join(' ');

    const actionsClass = [
        css.actions,
        actionsAlign === 'between' && css['actions-between'],
    ]
        .filter(Boolean)
        .join(' ');

    const closeButton = (
        <button
            type="button"
            className={closeOutside ? `${css.close} ${css['close-outside']}` : css.close}
            aria-label="Close"
            onClick={onClose}
        >
            <CloseIcon />
        </button>
    );

    return (
        // Линтер не любит обработчики событий у <dialog>, но здесь они нужны:
        // клик по фону и Esc — стандартные способы закрыть модальное окно.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <dialog
            ref={dialogRef}
            className={css.modal}
            style={{ width }}
            aria-labelledby={title ? titleId : undefined}
            onKeyDown={handleKeyDown}
            onCancel={handleCancel}
            onClick={handleClick}
        >
            {closeOutside && closeButton}

            {title && (
                <div className={headerClass}>
                    {hasCustomHeader && (
                        <div className={css['header-left']}>{headerLeft}</div>
                    )}
                    <h2 id={titleId} className={css.title}>
                        {title}
                    </h2>
                    {hasCustomHeader && (
                        <div className={css['header-right']}>{headerRight}</div>
                    )}
                    {!hasCustomHeader && !closeOutside && closeButton}
                </div>
            )}

            {title ? (
                <div className={bodyClass}>
                    {children}
                    {actions && <div className={actionsClass}>{actions}</div>}
                </div>
            ) : (
                children
            )}
        </dialog>
    );
};
