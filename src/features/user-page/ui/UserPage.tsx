import styles from '@/features/user-page/ui/userpage.module.css'



export const UserPage = () => {

  return (
    <section className={styles.container}>
      <img
        className={styles.mainImage}
        // src={viewSrc}
        src={"картинка"}
        alt={"Фотографий нет"}
      />

      <div className={styles.mainCard}>
        <div className={styles.mainDescription}>
          <img
            className={styles.mainAvatar}
            // src={mainSrc}
            src={"К"}
            alt={"Фотографий нет"}
          />
          <h3 className={styles.mainName}>UserName</h3>
        </div>
        <div>
          <p className={styles.timeAgo}>{'22 min ago'}</p>
          <p className={styles.mainText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
        </div>
      </div>
    </section>


  )
}