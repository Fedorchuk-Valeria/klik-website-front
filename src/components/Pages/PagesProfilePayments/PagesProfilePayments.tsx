"use client";

import {useRouter} from "next/navigation";
import {useAppDispatch} from "@/src/store/hooks";
import {PAGES} from "@/src/utils/constant";
import ButtonBack from "@/src/components/ui/ButtonBack/ButtonBack";
import Button from "@/src/components/ui/Button/Button";
import Icon from "@/src/components/ui/Icon/Icon";

const PagesProfilePayments = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    router.push(PAGES.PROFILE);
  };

  const handleFilter = () => {
    router.push(PAGES.PROFILE);
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
            <div className="page__profile__header-actions">
              <Button
                className={"page__profile__header-btn"}
                variant="orange"
                onClick={handleFilter}
              >
                Отфильтровать
              </Button>
            </div>
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
                  <th>Ссылка на чек</th>
                </tr>
                </thead>

                <tbody>
                {payments.map((payment, key) => (
                  <tr key={key}>
                    <td>{payment.programName}</td>
                    <td>{payment.childName}</td>
                    <td>{payment.paymentDate}</td>
                    <td>{payment.amount}</td>
                    <td>
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
