// Крестик в заголовке. currentColor — цвет берётся из кнопки
export const CloseIcon = (): React.JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
