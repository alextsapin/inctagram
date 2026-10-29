'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import type { Post } from '@/entities/profile';

import css from './post-modal.module.scss';

const ArrowBackIcon = (): React.JSX.Element => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
            d="M27.6601 38.0001C27.3613 38.0011 27.0661 37.9351 26.7961 37.8071C26.5262 37.679 26.2883 37.4921 26.1001 37.2601L16.4401 25.2601C16.1459 24.9022 15.9851 24.4533 15.9851 23.9901C15.9851 23.5268 16.1459 23.0779 16.4401 22.7201L26.4401 10.7201C26.7796 10.3116 27.2674 10.0548 27.7962 10.006C28.3251 9.95726 28.8517 10.1206 29.2601 10.4601C29.6685 10.7995 29.9254 11.2874 29.9741 11.8162C30.0229 12.3451 29.8596 12.8716 29.5201 13.2801L20.5801 24.0001L29.2201 34.7201C29.4646 35.0136 29.62 35.3711 29.6678 35.7502C29.7155 36.1293 29.6537 36.5142 29.4896 36.8592C29.3255 37.2043 29.0659 37.4951 28.7417 37.6973C28.4175 37.8995 28.0422 38.0045 27.6601 38.0001Z"
            fill="currentColor"
        />
    </svg>
);

const ArrowForwardIcon = (): React.JSX.Element => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
            d="M20.0001 37.9999C19.5328 38.0008 19.0799 37.838 18.7201 37.5399C18.5176 37.372 18.3502 37.1658 18.2275 36.9331C18.1048 36.7004 18.0292 36.4458 18.005 36.1838C17.9809 35.9219 18.0086 35.6577 18.0867 35.4065C18.1648 35.1553 18.2917 34.922 18.4601 34.7199L27.4201 23.9999L18.7801 13.2599C18.614 13.0553 18.4899 12.8199 18.415 12.5672C18.3402 12.3146 18.316 12.0496 18.3439 11.7875C18.3717 11.5255 18.4511 11.2715 18.5775 11.0402C18.7038 10.8089 18.8746 10.6049 19.0801 10.4399C19.287 10.2578 19.5294 10.1205 19.7919 10.0365C20.0544 9.95252 20.3315 9.92371 20.6057 9.95188C20.8798 9.98005 21.1452 10.0646 21.3852 10.2002C21.6252 10.3358 21.8345 10.5195 22.0001 10.7399L31.6601 22.7399C31.9543 23.0977 32.1151 23.5466 32.1151 24.0099C32.1151 24.4731 31.9543 24.922 31.6601 25.2799L21.6601 37.2799C21.4595 37.5219 21.2046 37.7132 20.9162 37.8383C20.6278 37.9634 20.3139 38.0188 20.0001 37.9999Z"
            fill="currentColor"
        />
    </svg>
);

const HeartIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M12 21C11.8684 21.0008 11.7379 20.9755 11.6161 20.9258C11.4943 20.876 11.3834 20.8027 11.29 20.71L3.51999 12.93C2.54536 11.9452 1.99866 10.6156 1.99866 9.23C1.99866 7.84443 2.54536 6.51482 3.51999 5.53C4.50226 4.55051 5.83283 4.00047 7.21999 4.00047C8.60716 4.00047 9.93773 4.55051 10.92 5.53L12 6.61L13.08 5.53C14.0623 4.55051 15.3928 4.00047 16.78 4.00047C18.1672 4.00047 19.4977 4.55051 20.48 5.53C21.4546 6.51482 22.0013 7.84443 22.0013 9.23C22.0013 10.6156 21.4546 11.9452 20.48 12.93L12.71 20.71C12.6166 20.8027 12.5057 20.876 12.3839 20.9258C12.2621 20.9755 12.1316 21.0008 12 21ZM7.21999 6C6.79667 5.99809 6.37717 6.08018 5.9858 6.24154C5.59443 6.40289 5.23897 6.6403 4.93999 6.94C4.33605 7.54712 3.99703 8.36865 3.99703 9.225C3.99703 10.0814 4.33605 10.9029 4.93999 11.51L12 18.58L19.06 11.51C19.6639 10.9029 20.003 10.0814 20.003 9.225C20.003 8.36865 19.6639 7.54712 19.06 6.94C18.4437 6.35771 17.6279 6.0333 16.78 6.0333C15.9321 6.0333 15.1163 6.35771 14.5 6.94L12.71 8.74C12.617 8.83373 12.5064 8.90812 12.3846 8.95889C12.2627 9.00966 12.132 9.0358 12 9.0358C11.868 9.0358 11.7373 9.00966 11.6154 8.95889C11.4936 8.90812 11.383 8.83373 11.29 8.74L9.49999 6.94C9.20102 6.6403 8.84556 6.40289 8.45419 6.24154C8.06281 6.08018 7.64332 5.99809 7.21999 6Z"
            fill="currentColor"
        />
    </svg>
);

type PostModalProps = {
    open: boolean;
    post: Post | null;
    onClose: () => void;
};

export const PostModal = ({
    open,
    post,
    onClose,
}: PostModalProps): React.JSX.Element | null => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [activeImage, setActiveImage] = useState(0);

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

    useEffect(() => {
        if (post) {
            setActiveImage(0);
        }
    }, [post]);

    if (!post) {
        return null;
    }

    const { images } = post;
    const hasMultiple = images.length > 1;
    const prevImage = (): void =>
        setActiveImage(current => (current - 1 + images.length) % images.length);
    const nextImage = (): void =>
        setActiveImage(current => (current + 1) % images.length);

    return (
        <dialog ref={dialogRef} className={css.modal} aria-label="Post" onClose={onClose}>
            <button
                type="button"
                className={css.close}
                aria-label="Close"
                onClick={onClose}
            >
                <CloseIcon />
            </button>

            <div className={css.split}>
                <div className={css.gallery}>
                    <div className={css.image}>
                        <Image
                            src={images[activeImage]}
                            alt="publication"
                            fill
                            className={css['image-content']}
                            sizes="490px"
                        />
                    </div>

                    {hasMultiple && (
                        <>
                            <button
                                type="button"
                                className={css.arrow}
                                aria-label="Previous image"
                                onClick={prevImage}
                            >
                                <ArrowBackIcon />
                            </button>
                            <button
                                type="button"
                                className={css.arrow}
                                aria-label="Next image"
                                onClick={nextImage}
                            >
                                <ArrowForwardIcon />
                            </button>

                            <div className={css.dots}>
                                {images.map((src, index) => (
                                    <span
                                        key={src}
                                        className={[
                                            css.dot,
                                            index === activeImage && css['dot-active'],
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className={css.side}>
                    <div className={css.header}>
                        <div className={css.avatar}>
                            <Image
                                src="/profile/avatar.png"
                                alt="author avatar"
                                width={36}
                                height={36}
                            />
                        </div>
                        <span className={css.username}>UserName</span>
                    </div>

                    <div className={css.comments}>
                        {post.comments.map(comment => (
                            <div key={comment.id} className={css.comment}>
                                <div className={css.avatar}>
                                    <Image
                                        src={comment.avatarUrl}
                                        alt={`${comment.username} avatar`}
                                        width={36}
                                        height={36}
                                    />
                                </div>
                                <div className={css['comment-body']}>
                                    <p className={css['comment-text']}>
                                        <span className={css['comment-name']}>
                                            {comment.username}
                                        </span>{' '}
                                        {comment.text}
                                    </p>
                                    <span className={css.time}>{comment.createdAt}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={css.footer}>
                        <div className={css.likes}>
                            <HeartIcon />
                            <span className={css['likes-count']}>
                                {post.likes.toLocaleString('en-US').replace(/,/g, ' ')}{' '}
                                &quot;Like&quot;
                            </span>
                        </div>
                        <span className={css.date}>{post.createdAt}</span>
                    </div>
                </div>
            </div>
        </dialog>
    );
};

const CloseIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
