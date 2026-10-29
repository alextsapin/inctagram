import styles from './registered-users.module.scss';

type RegisteredUsersProps = {
  values?: string;
};

export const RegisteredUsers = ({ values = '009213' }: RegisteredUsersProps) => {
  const digits = values.split('');

  return (
    <div className={styles['registered-users']}>
      <div className={styles['counter-group']}>
        <h2 className={styles.title}>Registered users:</h2>
        <div
          className={styles.counter}        
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