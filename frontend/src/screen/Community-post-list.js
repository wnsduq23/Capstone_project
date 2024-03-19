import Footer from "../component/Footer";
import Header from "../component/Header";
import "../styles/styles.css";
import styles from "../styles/community.module.css";
import { Link } from "react-router-dom";
import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable, //
  getPaginationRowModel,
} from "@tanstack/react-table";

function Post() {
  return (
    <div className={styles.postBtnContainer}>
      <Link to={`/community-post-form`}>
        <button className={styles.postBtn}>글 작성</button>
      </Link>
    </div>
  );
}

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "번호",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("subject", {
    header: () => "제목",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("createDate", {
    header: () => "날짜",
    cell: (info) => {
      const rawDate = new Date(info.row.original.createDate);
      const currentDate = new Date();
      const differenceInTime = Math.abs(
        currentDate.getTime() - rawDate.getTime()
      );
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      let formattedDate;
      if (differenceInDays < 1) {
        formattedDate = new Date(
          rawDate.getTime() + 9 * 60 * 60 * 1000
        ).toLocaleString("ko-KR", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        });
      } else {
        formattedDate = new Date(rawDate).toLocaleString("ko-KR", {
          month: "numeric",
          day: "numeric",
        });
      }

      return formattedDate;
    },
  }),
];

function CommunityTable() {
  function SearchBar() {
    const handleSearchClick = (e) => {
      e.preventDefault();
      const keyword = document.body.querySelector("#keyword");
      const searchOption = document.body.querySelector("#searchOption");
      console.log(searchOption.value);

      const search = async (keywordValue, searchOptionValue) => {
        const formData = new FormData();
        formData.append("keyword", keywordValue);
        formData.append("searchOption", searchOptionValue);
        try {
          const response = await fetch("/community_post/search", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error();
          }
          const tmpData = await response.json();
          setData(tmpData);
        } catch (e) {}
      };
      search(keyword.value, searchOption.value);
    };

    return (
      <form className={styles.searchBar}>
        <div className={styles.searchBargrid1}>
          <label htmlFor="keyword"> 검색어: </label>
          <input
            id="keyword"
            name="keyword"
            type="text"
            placeholder="검색어를 입력하세요"
          />
        </div>
        <div className={styles.searchBargrid2}>
          <label htmlFor="searchOption">검색 옵션: </label>
          <select id="searchOption" name="searchOption">
            <option value="title">제목</option>
            <option value="titleAndContent">제목과 내용</option>
          </select>
        </div>
        <div className={styles.searchBargrid3}>
          <button onClick={handleSearchClick}>
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
      </form>
    );
  }
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/community_post/list");
        if (!response.ok) {
          alert("오류가 발생했습니다");
        }
        console.log(response);
        const tmpData = await response.json();
        console.log(tmpData);
        setData(tmpData);
      } catch (e) {
        const a = document.createElement("a");
        a.href = "/";
        document.body.appendChild(a);
        a.click();
      }
    };
    loadData();
  }, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const handleRowClick = (id) => {
    const a = document.createElement("a");
    a.href = `community-post/${id}`;
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div>
      <SearchBar />
      <table>
        <thead className={styles.tableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={
                    index === 1 ? styles.titleHeader : styles.noneTitleHeader
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tableColumn}>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={styles.columnContainer}
              onClick={() => handleRowClick(row.original.id)}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={
                    index === 1 ? styles.titleColumn : styles.noneTitleColumn
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pageContainer}>
        <button
          className={styles.pageBtn}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className={styles.pageBtn}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span>
          <strong>
            {table.getPageCount()}쪽 중{" "}
            {table.getState().pagination.pageIndex + 1}쪽
          </strong>
        </span>
        <button
          className={styles.pageBtn}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className={styles.pageBtn}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

function CommunityScreen() {
  return (
    <div>
      <Header title="커뮤니티" />
      <div className={styles.communityContainer}>
        <Post />
        <CommunityTable />
      </div>
      <Footer />
    </div>
  );
}

export default CommunityScreen;
