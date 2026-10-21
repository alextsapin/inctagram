import { UserPage } from '@/features/user-page/ui/UserPage'






export const Main = () => {
  return (
    <section>
      {/* // <RegisteredUser /> */}
      <article style={{ display: 'flex', alignItems: "center", justifyContent: "center", padding: '5px' }}>
        <UserPage />
        <UserPage />
        <UserPage />
        <UserPage />
      </article>
    </section>
  )
}