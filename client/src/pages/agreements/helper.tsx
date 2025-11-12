import { format } from "date-fns";
import { AgreementDocument, DocumentTypeModel } from "../../types";
import { TFunction } from "i18next";
import { translationKeys } from "../../lang/translationKeys";
import moment from "moment";

const documentTypeMapping: Record<DocumentTypeModel, string> = {
  [DocumentTypeModel.OTHER_LETTER]: "Offer Letter",
  [DocumentTypeModel.ORDER_FORM]: "Order Form",
  [DocumentTypeModel.OTHER]: "Other",
};

export const mapDocumentType = (type: string | null | undefined) => {
  if (!type) return "-";
  const documentTypeMapping: Record<string, string> = {
    "Offer Letter": "Offer Letter",
    "Order Form": "Order Form",
    "Miscellaneous agreement": "Miscellaneous",
  };
  return documentTypeMapping[type] || type;
};

export const getUniqueDocumentTypes = (
  agreements: AgreementDocument[]
): string[] => {
  const types = agreements.map((a) => mapDocumentType(a.type));
  return Array.from(new Set(types));
};

export const getColumns = (
  handleAction: (record: AgreementDocument) => void,
  t: TFunction<"translation", undefined>
) => [
  {
    title: t(translationKeys.NAME),
    dataIndex: "fileName",
    key: "fileName",
    render: (_: any, record: AgreementDocument) => record.fileName,
  },
  {
    title: t(translationKeys.PARTIES),
    dataIndex: "parties",
    key: "parties",
    render: (_: any, record: AgreementDocument) =>
      record.parties?.map((party) => party.nameInAgreement).join(", ") ?? "-",
  },
  {
    title: t(translationKeys.DOCUMENT_TYPE),
    dataIndex: "type",
    key: "type",
    render: (_: any, record: AgreementDocument) => {
      return (
        <div className="table-doc-type-container">
          <span className="table-doc-type">{mapDocumentType(record.type)}</span>
        </div>
      );
    },
  },
  {
    title: t(translationKeys.EXPIRATION_DATE),
    dataIndex: "expirationDate",
    key: "expirationDate",
    render: (_: any, record: AgreementDocument) =>
      record.provisions?.expirationDate
        ? format(
            moment(record.provisions.expirationDate).toDate(),
            "yyyy/MM/dd"
          )
        : "-",
  },
  {
    title: t(translationKeys.ACTIONS),
    key: "actions",
    render: (_: any, record: AgreementDocument) => (
      <div>
        <button className="tableButton" onClick={() => handleAction(record)}>
          View
        </button>
      </div>
    ),
  },
];

export const getNestedValue = (obj: AgreementDocument, path: string) => {
  switch (path) {
    case "fileName":
      return obj.fileName;
    case "type":
      return obj.type;
    case "parties":
      return (
        obj?.parties?.map((party) => party.nameInAgreement).join(", ") ?? "-"
      );
    case "expirationDate":
      return obj.provisions?.expirationDate
        ? moment(obj.provisions.expirationDate).toDate()
        : new Date();
    default:
      return "";
  }
};
