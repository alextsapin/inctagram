'use client';

import { type SelectOption } from '../lib/types';
import { useSelect } from '../lib/useSelect';

import { ArrowIcon } from './ArrowIcon';
import css from './select.module.scss';

type SelectProps = {
    options: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    // Название поля для скринридера, когда видимой подписи (<label>) нет. Например, выбор языка в шапке
    'aria-label'?: string;
};

// Только разметка и классы. Как список открывается, что подсвечено
// и как работает клавиатура — в хуке useSelect (../lib/useSelect.ts)
export const Select = ({
    options,
    value,
    onChange,
    id,
    placeholder = 'Select',
    disabled = false,
    // Имя с дефисом нельзя сделать переменной, поэтому при разборе пропсов переименовываем
    'aria-label': ariaLabel,
}: SelectProps): React.JSX.Element => {
    const {
        rootRef,
        listId,
        isOpen,
        activeIndex,
        selectedOption,
        getOptionId,
        toggle,
        choose,
        highlight,
        handleKeyDown,
    } = useSelect({ options, value, onChange });

    const triggerClass = isOpen ? `${css.trigger} ${css.open}` : css.trigger;

    return (
        <div ref={rootRef} className={css.root}>
            <button
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listId}
                aria-activedescendant={isOpen ? getOptionId(activeIndex) : undefined}
                aria-label={ariaLabel}
                className={triggerClass}
                disabled={disabled}
                onClick={toggle}
                onKeyDown={handleKeyDown}
            >
                {selectedOption ? (
                    <span className={css.value}>
                        {selectedOption.icon}
                        {selectedOption.label}
                    </span>
                ) : (
                    <span className={css.placeholder}>{placeholder}</span>
                )}
                <ArrowIcon className={css.arrow} />
            </button>

            {isOpen && (
                <ul id={listId} role="listbox" className={css.list}>
                    {options.map((option, index) => (
                        // Клавиатуру обрабатывает кнопка выше, поэтому у пункта только мышь
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <li
                            key={option.value}
                            id={getOptionId(index)}
                            role="option"
                            aria-selected={option.value === value}
                            className={
                                index === activeIndex
                                    ? `${css.option} ${css.active}`
                                    : css.option
                            }
                            // onMouseMove, а не onMouseEnter: при листании стрелками пункты
                            // проезжают под неподвижным курсором, и подсветка не должна прыгать
                            onMouseMove={() => highlight(index)}
                            onClick={() => choose(option)}
                        >
                            {option.icon}
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
