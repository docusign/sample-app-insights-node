import React, { useEffect, useState } from "react";
import SortingIcon from "../../../components/SVGIcons/SortingIcon";
import SortingUpIcon from "../../../components/SVGIcons/SortingUpIcon";
import SortingDownIcon from "../../../components/SVGIcons/SortingDownIcon";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AgreementDocument } from "../../../types";
import {
  getColumns,
  getNestedValue,
  getUniqueDocumentTypes,
  mapDocumentType,
} from "../helper";
import PaginationTable from "./pagination";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../../lang/translationKeys";
import TableFilters from "./filters";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_MOBILE,
} from "../../../constants";
import { DefaultOptionType } from "antd/es/select";
import "./styles.css";

type TSortTable = "ASC" | "DESC";

export type TEventDate = {
  date: string | undefined;
  event: React.ChangeEvent<HTMLSelectElement> | null;
};
export const DEFAULT_TYPE = "Document Type";
export type TFilterTable = {
  searchText: string;
  documentType: string | undefined;
  expirationDate: TEventDate;
};

interface SortConfig {
  key: string;
  direction: TSortTable;
}

type AgreementsTableProps = {
  data: AgreementDocument[];
};

const AgreementsTable: React.FC<AgreementsTableProps> = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isMobileView, setIsMobileView] = useState(false);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageSizeMobile, setPageSizeMobile] = useState(
    DEFAULT_PAGE_SIZE_MOBILE
  );
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);

  const [filters, setFilters] = useState<TFilterTable>({
    searchText: "",
    expirationDate: {} as TEventDate,
    documentType: undefined as string | undefined,
  });

  const [filteredData, setFilteredData] = useState(data);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement> | null) => {
    const value = event?.target?.value ?? "";
    setFilters((prev) => ({
      ...prev,
      searchText: value,
    }));
  };


  const handleFilterDate = (date?: any, dateString?: string | string[]) => {
    const selectedDate = Array.isArray(dateString) ? dateString[0] : dateString;

    setFilters((prev) => ({
      ...prev,
      expirationDate: date
        ? { date: selectedDate, event: date }
        : ({} as TEventDate),
    }));
  };
  const handleFilterType = (
    value: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      documentType:
        value !== DEFAULT_TYPE ? value : (undefined as string | undefined),
    }));
  };
useEffect(() => {
  let filtered = data;
  if (filters.searchText) {
    filtered = filtered.filter((item) =>
      item.fileName?.valueOf().toLowerCase().includes(filters.searchText.toLowerCase())
    );
  }

  if (filters.documentType) {
    filtered = filtered.filter(
      (item) => mapDocumentType(item.type) === filters.documentType
    );
  }

  if (filters.expirationDate.date) {
    filtered = filtered.filter((item) => {
      const itemExpirationDate = item.provisions?.expirationDate;
      return (
        itemExpirationDate &&
        moment(itemExpirationDate).isSame(
          moment(filters.expirationDate.date),
          "day"
        )
      );
    });
  }

  setFilteredData(filtered);
}, [filters, data]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "ASC",
  });
  const handleSort = (key: string) => {
    let direction: TSortTable = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = [...filteredData].sort((a, b) => {
    const sortKey = sortConfig.key || "fileName";
    const aValue = getNestedValue(a, sortKey);
    const bValue = getNestedValue(b, sortKey);
    
    if (aValue === undefined || bValue === undefined) {
      return 0;
    }

    if (aValue < bValue) return sortConfig.direction === "ASC" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ASC" ? 1 : -1;
    
    return 0;
  });
  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <SortingIcon size={14} />;
    }

    return sortConfig.direction === "DESC" ? (
      <SortingUpIcon size={14} />
    ) : (
      <SortingDownIcon size={14} />
    );
  };

  const canLoadMoreMobileData = data.length > pageSizeMobile;
  const startIndex = isMobileView ? 0 : (pageNumber - 1) * pageSize;
  const endIndex = isMobileView ? pageSizeMobile : startIndex + pageSize;
  const handleNextPage = () =>
    pageNumber < Math.ceil(filteredData.length / pageSize) &&
    setPageNumber((prev) => prev + 1);
  const handlePreviousPage = () =>
    pageNumber > 1 && setPageNumber((prev) => prev - 1);
  const handleFirstPage = () => setPageNumber(1);
  const handleLastPage = () =>
    setPageNumber(Math.ceil(filteredData.length / pageSize));
  const handleLoadMore = () =>
    canLoadMoreMobileData &&
    setPageSizeMobile((prev) => prev + DEFAULT_PAGE_SIZE_MOBILE);

  const handleAction = (record: AgreementDocument) =>
    navigate(`/agreement-details/${record.id}`);
  const columns = getColumns(handleAction, t);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 705);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="content-container">
      <div className="content-wrap-container">
        <TableFilters
          filters={filters}
          uniqueTypes={getUniqueDocumentTypes(data)}
          handleSearch={handleSearch}
          handleFilterDate={handleFilterDate}
          handleFilterType={handleFilterType}
        />
        {filteredData.length ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th
                      scope="col"
                      key={index + new Date().getUTCMilliseconds()}
                    >
                      <button
                        className="icon-button"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="table-th-container">
                          <span>{col.title.toUpperCase()}</span>
                          {index !== columns.length - 1 &&
                            renderSortIcon(col.dataIndex ?? col.key)}
                        </div>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.slice(startIndex, endIndex).map((item) => (
                  <tr key={item.id}>
                    {columns.map((col, index) => (
                      <td
                        key={index + new Date().getUTCMilliseconds()}
                        data-label={col.title}
                      >
                        {col.render(undefined, item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {isMobileView ? (
              <div className="load-more-btn-section">
                {canLoadMoreMobileData && (
                  <button
                    className="load-more-btn"
                    disabled={!canLoadMoreMobileData}
                    onClick={handleLoadMore}
                  >
                    {t(translationKeys.LOAD_MORE)}
                  </button>
                )}
              </div>
            ) : (
              <PaginationTable
                pageSize={pageSize}
                currentPageNumber={pageNumber}
                setPageSize={setPageSize}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                handlePage={(pageNumber: number) =>
                  setPageNumber(pageNumber ?? 1)
                }
                handleFirstPage={handleFirstPage}
                handleLastPage={handleLastPage}
                filteredData={filteredData}
              />
            )}
          </div>
        ) : (
          <div className="table-container">
            <div className="empty-data">
              <h2>
                {t(
                  filters.searchText
                    ? translationKeys.SEARCH_NO_DATA_TITLE
                    : translationKeys.NO_DATA_TO_SHOWN,
                  filters.searchText ? { searchTerm: filters.searchText } : {}
                )}
              </h2>
              <p>
                {t(
                  filters.searchText
                    ? translationKeys.SEARCH_NO_DATA
                    : translationKeys.NO_DATA_TO_SHOWN
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgreementsTable;
