import { UserPage } from '@/features/user-page/ui/UserPage'
import styles from '@/features/user-page/ui/main.module.css'





export const Main = () => {
  return (
    <section>
      {/* // <RegisteredUser /> */}
      <div className={styles.MainContainer}>
        <UserPage />
        <UserPage />
        <UserPage />
        <UserPage />
      </div>
    </section >
  )
}