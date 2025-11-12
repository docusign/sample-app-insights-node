import React from "react";
import { format } from "date-fns";
import { AgreementDocument } from "../../../types";
import { useTranslation } from "react-i18next";
import { translationKeys } from "../../../lang/translationKeys";
import { mapDocumentType } from "../../agreements/helper";
import "./styles.css";
import { useAppDispatch } from "../../../store";
import { fetchAgreementById } from "../../../store/state/agreements";
import moment from "moment";

type AgreementCardProps = {
  agreement: AgreementDocument;
};

const AgreementCard: React.FC<AgreementCardProps> = ({ agreement }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const agreementType = mapDocumentType(agreement.type);
  const parties = agreement.parties
    ? agreement.parties.map((party) => party.nameInAgreement).join(", ")
    : "-";
  const effectiveDate = agreement.provisions?.effectiveDate
    ? format(moment(agreement.provisions.effectiveDate).toDate(), "yyyy/MM/dd")
    : "-";
  const expirationDate = agreement.provisions?.expirationDate
    ? format(
        moment(agreement.provisions.expirationDate).toDate(),
        "yyyy/MM/dd"
      )
    : "-";

  const renewalType = agreement?.provisions?.assignmentType ?? "-";
  const renewalNoticePeriod = agreement?.provisions?.executionDate ?? "-";
  const renewalNoticeDate = agreement?.provisions?.executionDate ?? "-";
  const renewalTerm = agreement?.provisions?.executionDate ?? "1 year";
  const renewalOwner = agreement?.parties?.[0]?.nameInAgreement ?? "-";
  const additionalInfo = agreement?.additionalCustomEsignData?.[0]?.label ?? "-";
  const handleRefresh = () => {
    dispatch(fetchAgreementById(agreement.id) as any)
  }

  return (
    <div className="agreement-details-card-container">
      <div className="agreement-details-card-main-section">
        <div className="agreement-details-card-main-section-header">
          <div className="agreement-details-card-main-section-header-item">
            <h2>{t(translationKeys.AGREEMENT_DETAILS_AGREEMENT)}</h2>
          </div>
          <div className="agreement-details-card-main-section-header-item">
            <button className="tableButton" onClick={handleRefresh}>
              {t(translationKeys.AGREEMENT_DETAILS_AGREEMENT_REFRESH)}
            </button>
          </div>
        </div>
        <div className="agreement-details-card-type-section">
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_AGREEMENT_TYPE)}
            </div>
            <div className="agreement-details-value">{agreementType}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_AGREEMENT_PARTY)}
            </div>
            <div className="agreement-details-value">{parties}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_AGREEMENT_EFFECTIVE_DATE)}
            </div>
            <div className="agreement-details-value">{effectiveDate}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_AGREEMENT_EXPIRATION_DATE)}
            </div>
            <div className="agreement-details-value">{expirationDate}</div>
          </div>
        </div>
        <h2>{t(translationKeys.AGREEMENT_DETAILS_RENEWAL)}</h2>
        <div className="agreement-details-card-type-section">
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_TYPE)}
            </div>
            <div className="agreement-details-value">{renewalType}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_NOTICE_PERIOD)}
            </div>
            <div className="agreement-details-value">{renewalNoticePeriod}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_NOTICE_DATE)}
            </div>
            <div className="agreement-details-value">{renewalNoticeDate}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_TERM)}
            </div>
            <div className="agreement-details-value">{renewalTerm}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_OWNER)}
            </div>
            <div className="agreement-details-value">{renewalOwner}</div>
          </div>
          <div className="agreement-details-item">
            <div className="agreement-details-label">
              {t(translationKeys.AGREEMENT_DETAILS_RENEWAL_ADDITIONAL_INFO)}
            </div>
            <div className="agreement-details-value">{additionalInfo}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementCard;
