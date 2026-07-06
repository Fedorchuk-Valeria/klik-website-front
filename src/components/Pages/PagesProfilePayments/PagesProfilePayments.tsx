"use client";

import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/src/store/hooks";
import {PAGES} from "@/src/utils/constant";
import ButtonBack from "@/src/components/ui/ButtonBack/ButtonBack";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import DateRangePicker from "@/src/components/ui/DateRangePicker";
import {useEffect, useState} from "react";
import Loader from "@/src/components/ui/Loader/Loader";
import {getPaymentHistoryCalendarRequest, getPaymentHistoryRequest} from "@/src/store/slices/profile";

const PagesProfilePayments = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { paymentHistory, availableDates, isLoading } = useAppSelector((store) => store.profile);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const handleBack = () => {
    router.push(PAGES.PROFILE);
  };

  const handleFilter = () => {
    dispatch( getPaymentHistoryRequest({ date_from: formatDate(dateFrom), date_to: formatDate(dateTo), }) );
  };

  const handleReset = () => {
    setDateFrom(null);
    setDateTo(null);

    dispatch(getPaymentHistoryRequest());
  };

  const formatDate = (date: Date | null) => date?.toISOString().slice(0, 10);

  useEffect(() => {
    dispatch(getPaymentHistoryRequest());
    dispatch(getPaymentHistoryCalendarRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getPaymentHistoryCalendarRequest({
        date_from: formatDate(dateFrom),
        date_to: formatDate(dateTo),
      })
    );
  }, [dateFrom, dateTo]);

  if (isLoading || !paymentHistory) {
    return <Loader />;
  }

  return (
    <div className="page-profile">
      <div className="platform-layout__container">
        <div className="page-profile__content">
          <ButtonBack
            label="Вернуться к профилю"
            className="page-profile__back"
            onClick={handleBack}
          />
          <div className="page-profile__header">
            <h1>История платежей</h1>
            {paymentHistory.length > 0 && (
            <div className="page-profile__header-actions">
              {(dateFrom || dateTo) && (
                <button
                  className="page-profile__reset"
                  onClick={handleReset}
                >
                  Очистить
                </button>
              )}
              <div className="page-profile__date">
                <DateRangePicker
                  valueFrom={dateFrom}
                  valueTo={dateTo}
                  onChange={({ from, to }) => {
                    setDateFrom(from);
                    setDateTo(to);
                  }}
                />
              </div>
              <Button
                className={"page-profile__header-btn"}
                variant="orange"
                onClick={handleFilter}
              >
                Отфильтровать
              </Button>
            </div>)}
          </div>
          {paymentHistory.length === 0 ? (
            <div className="page-profile__table-wrapper empty">
              Платежей пока нет
            </div>
          ) : (
            <div className="page-profile__table-wrapper">
              <table className="table">
                <thead>
                <tr>
                  <th>Название программы</th>
                  <th>ФИО ребёнка</th>
                  <th>Дата оплаты</th>
                  <th>Сумма к оплате</th>
                  <th></th>
                </tr>
                </thead>

                <tbody>
                {paymentHistory.map((payment, key) => (
                  <tr key={key}>
                    <td data-label="Название программы">{payment.course_title}</td>
                    <td data-label="ФИО ребёнка" className="hidden"><span>{payment.child_full_name}</span></td>
                    <td data-label="Дата оплаты">{new Date(payment.paid_at).toLocaleDateString("ru-RU")}</td>
                    <td className="without-border" data-label="Сумма к оплате"><span className="page-profile__currency">{payment.amount} <Icon className="page-profile__currency-icon" name="ruble" /></span></td>
                    <td className="without-border">
                      <a
                        href={payment.receipt_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="page-profile__download"
                          variant="main-green-dark"
                        >
                          <Icon name="download" />
                          Скачать чек
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesProfilePayments;
