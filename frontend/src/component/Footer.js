import styles from "../styles/footer.module.css";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.tempContainer}>
        <span className={styles.number}> 문의 : 010-2684-1833</span>
      </div>
    </div>
  );
}

export default Footer;
