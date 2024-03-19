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

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "번호",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("subject", {
    header: () => "해충명",
    cell: (info) => info.renderValue(),
  }),
];

function CommunityTable() {
  function SearchBar() {
    const handleSearchClick = (e) => {
      e.preventDefault();
      const keyword = document.body.querySelector("#keyword");

      const search = async (keywordValue) => {
        const formData = new FormData();
        formData.append("keyword", keywordValue);
        try {
          const response = await fetch("/baseUrl", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error();
          }
          const jsonData = await response.json();
          setData(jsonData);
        } catch (e) {}
      };
      //  search(keyword.value);
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
        const loadData = async () => {
          const response = await fetch("baseurl");
          if (!response.ok) {
            throw new Error();
          }
          const jsonData = await response.json();
          setData(jsonData);
        };
        //loadData();
      } catch (e) {}
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

function InsectInfoList() {
  return (
    <div>
      <Header title="해충 데이터 베이스" />
      <div className={styles.communityContainer}>
        <CommunityTable />
      </div>
      <Footer />
    </div>
  );
}

export default InsectInfoList;
