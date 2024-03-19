import Footer from "../component/Footer";
import Header from "../component/Header";

import styles from "../styles/community-post-form.module.css";

function Form() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subject", document.body.querySelector("#subject").value);
    formData.append("password", document.body.querySelector("#password").value);
    formData.append("content", document.body.querySelector("#content").value);
    try {
      const response = await fetch("/community_post/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error();
      }
      const a = document.createElement("a");
      a.href = "/community-post-list";
      document.body.appendChild(a);
      a.click();
    } catch (e) {}
  };
  return (
    <div>
      <form
        className={styles.formContainer}
        action="/community_post/create"
        method="post"
      >
        <div className={styles.formTitle}>
          <div>
            <label htmlFor="subject">제목</label>
            <input type="text" id="subject" name="subject" />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input type="password" id="password" name="password" />
          </div>
        </div>
        <textarea className={styles.formTextarea} name="content" id="content" />
        <div className={styles.formSubmitDiv}>
          <input
            className={styles.formSubmit}
            type="submit"
            value="등록하기"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}

function Community_post_form() {
  return (
    <div>
      <Header title="글 등록" />
      <Form />
      <Footer />
    </div>
  );
}

export default Community_post_form;
