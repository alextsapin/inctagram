import styles from './user-post-card.module.scss';
import Link from 'next/link';
import nature from '../assets/nature.jpg';
import tanya from '../assets/tanya.jpg';
import Image, { type StaticImageData } from 'next/image';





export const UserCard = () => {
return(
  <Link href="/" className={styles.link}>
      <article className={styles.card} >      
    <Image className={styles.postImage} src={nature} alt="Фото поста" />
<div className={styles.author}>             
              <Image className={styles.authorAvatar} src={tanya} alt="" />
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