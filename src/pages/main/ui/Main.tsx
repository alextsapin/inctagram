import style from './main.module.scss';
import { Header } from '@/widgets/header';
import { RegisteredUsers } from '@/widgets/registered-users';
import { UserCard } from '@/widgets/UserCard';


export const Main = () => {
return(
  <main className={style.main}>
    
<RegisteredUsers/>
<div className={style.container}>
<UserCard />
<UserCard />
<UserCard />
<UserCard />
    </div>
  </main>
)
}


