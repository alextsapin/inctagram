'use client';


import styles from './registered-users.module.scss';

type RegisteredUsersProps = {
  values?: string;
};

export const RegisteredUsers = ({ values = '009213' }: RegisteredUsersProps) => {
  const digits= Array.from(String(values).split('').join(''))

  return (
    <div className={styles.registeredUsers}>
      <div className={styles.counterGroup}>
        <h2 className={styles.title}>Registered users:</h2>
        <div
          className={styles.counter}
          // role="group"
          // aria-label={`Registered users: ${values}`}
        >
          {digits.map((digit, index) => (
            <span className={styles.item} key={index}>
              <span className={styles.digit}>{digit}</span>

              {index < digits.length - 1 && (
                <span className={styles.separator} aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};