import { useEffect, useState } from "react";
import Footer from "../component/Footer";
import Header from "../component/Header";
import styles from "../styles/community-context.module.css";
import { useParams } from "react-router-dom";

function CommunityContext() {
  const [subject, setSubject] = useState("");
  const [createDate, setCreateDate] = useState("");
  const { id } = useParams();
  console.log(id);
  const [content, setContent] = useState("");
  const [modifyDate, setModifyDate] = useState("");
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/community_post/detail?id=${id}`);
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setSubject(data.subject);
        const rawDate = new Date(data.createDate);

        const formattedDate = new Date(rawDate).toLocaleString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        });

        setCreateDate(formattedDate);
        setContent(data.content);
        setModifyDate(data.modifiedDate);
      } catch (e) {}
    };
    loadData();
  }, []);
  function Title() {
    const handleEditBtnClick = async (e) => {
      e.preventDefault();
      const a = document.createElement("a");
      a.href = `/community-post/edit/${id}`;
      document.body.appendChild(a);
      a.click();
    };
    const handleDeleteBtnClick = async (e) => {
      e.preventDefault();
      const password = document.body.querySelector("#password");
      const formData = new FormData();
      formData.append("password", password.value);
      try {
        const response = await fetch(`/community_post/delete?id=${id}`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error();
        }
        alert("삭제되었습니다");
        const a = document.createElement("a");
        a.href = "/community-post-list";
        document.body.appendChild(a);
        a.click();
      } catch (e) {}
    };
    return (
      <div className={styles.titleContainer}>
        <div className={styles.titleDiv}>
          <div>{subject}</div>
        </div>
        <div className={styles.noneTitleDiv}>
          <div>
            <div>{modifyDate ? modifyDate : createDate}</div>
          </div>
          <form id="buttonForm">
            <button onClick={handleEditBtnClick}>편집</button>
            <input
              name="password"
              id="password"
              type="password"
              required
              placeholder="삭제를 하시려면 비밀번호를 입력하세요"
            />

            <button onClick={handleDeleteBtnClick}>게시글 삭제</button>
          </form>
        </div>
      </div>
    );
  }
  function Context() {
    return (
      <div className={styles.contextContainer}>
        <p>{content}</p>
      </div>
    );
  }
  function CommentItem({ commentText, commentCreatedDate }) {
    const rawDate = new Date(commentCreatedDate);

    const formattedDate = new Date(rawDate).toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    return (
      <li className={styles.commentContainer}>
        <div>{commentText}</div>
        <div>
          <div>{formattedDate} </div>
        </div>
      </li>
    );
  }
  function Comment() {
    const [comments, setComments] = useState([]);
    useEffect(() => {
      const loadComments = async () => {
        try {
          const response = await fetch(
            `/community_post/detail_comment?id=${id}`
          );
          if (!response.ok) {
            throw new Error();
          }
          const data = await response.json();
          setComments(data);
        } catch (e) {}
      };
      loadComments();
    }, []);
    const handlePostComment = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append(
        "password",
        document.body.querySelector("#newPassword").value
      );
      formData.append(
        "content",
        document.body.querySelector("#newCommentContent").value
      );
      try {
        const response = await fetch(`/community_comment/create?id=${id}`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error();
        }
        const a = document.createElement("a");
        a.href = `/community-post/${id}`;
        document.body.appendChild(a);
        a.click();
      } catch (e) {}
    };
    return (
      <div>
        <ul>
          {comments.map((comment, id) => (
            <CommentItem
              key={id}
              commentText={comment.content}
              commentCreatedDate={
                comment.modifyDate ? comment.modifiedDate : comment.createDate
              }
            />
          ))}
        </ul>
        <div className={styles.addCommentContainer}>
          <form>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              id="newPassword"
            />
            <textarea placeholder="댓글을 입력하세요" id="newCommentContent" />
            <button onClick={handlePostComment}>등록</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Header title="커뮤니티" />
      <div className={styles.mainContainer}>
        <Title />
        <hr />
        <Context />
        <hr />
        <Comment />
      </div>
      <Footer />
    </div>
  );
}

export default CommunityContext;
