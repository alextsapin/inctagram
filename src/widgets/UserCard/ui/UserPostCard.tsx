import styles from '@/page/main/ui/menu-users.module.scss';
import Link from 'next/link';




export const UserCard = () => {
return(
  <Link href="/" className={styles.link}>
      <article className={styles.card} >
        <img
                className={styles.postImage}
                src={'ImageUrl'}
                alt={"Фото нет"}                
              />
<div className={styles.author}>
              <img
                className={styles.authorAvatar}
                src={'ImageUrl'}
                alt={"Фото нет"}                
              />
              <h3 className={styles.authorName }>{'UserName'}</h3> 
</div>
              <div>
                
                <p className={styles.publishedAt }>22 min ago</p>
                <p className={styles.postText}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, quia?</p>
              </div>
            </article>
    </Link>  
)
}