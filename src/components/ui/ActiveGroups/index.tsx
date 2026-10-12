import { Group } from "@/src/entities/common";
import { FC } from "react";

type PropTypes = {
  data: Group[] | null;
};

export const ActiveGroups: FC<PropTypes> = ({ data }) => {

  const groups = data?.map((item) => {
    const group = { ...item };

    (["location", "day_and_time", "next_lesson_topic"] as const).forEach((key) => {
      const value = group[key];

      if (value === null || value === undefined || String(value).trim() === "") {
        delete group[key];
      }
    });

    return group;
  });

  return (
    <div className="page-profile__groups">
      <div className="page-profile__groups-title">Офлайн-занятия в группе</div>
      <div className="page-profile__groups-list">
        {groups?.map((item, index) => (
          <div key={item.id ?? index} className="page-profile__group">
            <div className="page-profile__group-title">{item.title}</div>

            <div className="page-profile__group-list">
              {"location" in item && (
                <div className="page-profile__group-item">
                  <div className="page-profile__group-name">Локация</div>
                  <div className="page-profile__group-value">{item.location}</div>
                </div>
              )}

              {"day_and_time" in item && (
                <div className="page-profile__group-item">
                  <div className="page-profile__group-name">День и время занятия</div>
                  <div className="page-profile__group-value">{item.day_and_time}</div>
                </div>
              )}

              {"next_lesson_topic" in item && (
                <div className="page-profile__group-item">
                  <div className="page-profile__group-name">Тема следующего занятия</div>
                  <div className="page-profile__group-value">{item.next_lesson_topic}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
