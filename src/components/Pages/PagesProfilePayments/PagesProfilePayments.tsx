"use client";

import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/src/store/hooks";
import {PAGES} from "@/src/utils/constant";
import ButtonBack from "@/src/components/ui/ButtonBack/ButtonBack";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";
import DateRangePicker from "@/src/components/ui/DateRangePicker";
import {useState} from "react";

const PagesProfilePayments = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const handleBack = () => {
    router.push(PAGES.PROFILE);
  };

  const handleFilter = () => {
    console.log("from:", dateFrom);
    console.log("to:", dateTo);
  };

  const payments = [
    {
      programName: "Программа «Лето»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    },
    {
      programName: "Программа «Креаторы»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    },
    {
      programName: "Программа «Кодеры»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    },
    {
      programName: "Программа «Кликеры»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    },
    {
      programName: "Программа «Лето»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    },
    {
      programName: "Программа «Кликеры»",
      childName: "Фамилия Имя Отчество Ребёнка",
      paymentDate: "20.05.2026",
      amount: "220",
      receiptUrl: "#",
    }
  ];

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
            {payments.length > 0 && (
            <div className="page-profile__header-actions">
              {(dateFrom || dateTo) && (
                <button
                  className="page-profile__reset"
                  onClick={() => {
                    setDateFrom(null);
                    setDateTo(null);
                  }}
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
          {payments.length === 0 ? (
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
                {payments.map((payment, key) => (
                  <tr key={key}>
                    <td data-label="Название программы">{payment.programName}</td>
                    <td data-label="ФИО ребёнка" className="hidden"><span>{payment.childName}</span></td>
                    <td data-label="Дата оплаты">{payment.paymentDate}</td>
                    <td className="without-border" data-label="Сумма к оплате"><span className="page-profile__currency">{payment.amount} <Icon className="page-profile__currency-icon" name="ruble" /></span></td>
                    <td className="without-border">
                      <a
                        href={payment.receiptUrl}
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
