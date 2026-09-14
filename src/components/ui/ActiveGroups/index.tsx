import { Group } from "@/src/entities/common";
import { FC } from "react";

type PropTypes = {
  data: Group[] | null;
};

export const ActiveGroups: FC<PropTypes> = ({ data }) => {
  return (
    <div className="page-profile__groups">
      <div className="page-profile__groups-title">Офлайн-занятия в группе</div>
      <div className="page-profile__groups-list">
        {data?.map((item, index) => (
          <div key={index} className="page-profile__group">
            <div className="page-profile__group-title">{item.title}</div>
            <div className="page-profile__group-list">
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">Локация</div>
                <div className="page-profile__group-value">{item.location}</div>
              </div>
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">День и время занятия</div>
                <div className="page-profile__group-value">{item.day_and_time}</div>
              </div>
              <div className="page-profile__group-item">
                <div className="page-profile__group-name">Тема следующего занятия</div>
                <div className="page-profile__group-value">{item.next_lesson_topic}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
