import style from './main.module.scss';
import { Header } from '@/widgets/header';
import { RegisteredUsers } from '@/widgets/registered-users';
import { UserCard } from '@/widgets/UserCard';


export const Main = () => {
return(
  <main className={style.main}>
    <div className={style.container}>
<RegisteredUsers/>
<UserCard />
<UserCard />
<UserCard />
    </div>
  </main>
)
}


