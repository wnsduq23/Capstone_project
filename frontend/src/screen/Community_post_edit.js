import { useEffect, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/community-post-form.module.css";
import { useParams } from "react-router-dom";

function Form() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/community_post/edit?id=${id}`);
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setTitle(data.subject);
        setContent(data.content);
      } catch (e) {}
    };
    loadData();
  }, []);
  const titleChange = (e) => {
    setTitle(e.target.value);
  };
  const contentChange = (e) => {
    setContent(e.target.value);
  };
  const postEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const password = document.body.querySelector("#password");
    formData.append("subject", title);
    formData.append("content", content);
    formData.append("password", password.value);
    try {
      const response = await fetch(`/community_post/edit?id=${id}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error();
      }
      alert("수정이 되었습니다");
      const a = document.createElement("a");
      a.href = `/community-post/${id}`;
      document.body.appendChild(a);
      a.click();
    } catch (e) {
      alert("비밀번호가 맞지 않습니다");
    }
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
            <label for="subject"></label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={title}
              onChange={titleChange}
            />
          </div>
          <div>
            <label for="password"></label>
            <input type="password" id="password" name="password" />
          </div>
        </div>
        <textarea
          className={styles.formTextarea}
          name="content"
          id="content"
          value={content}
          onChange={contentChange}
        />
        <div className={styles.formSubmitDiv}>
          <input
            className={styles.formSubmit}
            type="submit"
            value="등록하기"
            onClick={postEdit}
          />
        </div>
      </form>
    </div>
  );
}

function Community_post_edit() {
  return (
    <div>
      <Header title="글 편집" />
      <Form />
      <Footer />
    </div>
  );
}

export default Community_post_edit;
