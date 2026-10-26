import css from '@/page/main/ui/main.module.scss';
import { Header } from '@/widgets/header';
import { RegisteredUsers } from '@/widgets/registered-users';
import { UserCard } from '@/widgets/UserCard';


export const Main = () => {
return(
  <main className={css.main}>
    <div className={`container`}>
<Header/>
<RegisteredUsers/>
<UserCard />
    </div>
  </main>
)
}


