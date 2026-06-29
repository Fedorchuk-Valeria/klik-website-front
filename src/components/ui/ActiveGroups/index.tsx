import { FC } from "react";

export type GroupPreview = {
  title: string;
  location: string;
  date: string;
  theme: string;
};

type PropTypes = {
  data: GroupPreview[] | null;
};

export const ActiveGroups: FC<PropTypes> = ({ data }) => {

  return (
    <div className="page-profile__groups">
      <div className="page-profile__groups-title">Офлайн-занятия в группе</div>
      <div className="page-profile__groups-list">
        {data?.map((item) => (
          <div className="page-profile__group">
            <div className="page-profile__group-title">{item.title}</div>
            <div className="page-profile__group-list">
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">Локация</div>
                <div className="page-profile__group-value">{item.location}</div>
              </div>
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">День и время занятия</div>
                <div className="page-profile__group-value">{item.date}</div>
              </div>
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">Тема следующего занятия</div>
                <div className="page-profile__group-value">{item.theme}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
