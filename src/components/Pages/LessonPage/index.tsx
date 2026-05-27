import { FC } from "react";

import TutorialList from "@/src/components/template-parts/Course/Tutorial/List";
import CourseProgress from "@/src/components/template-parts/Course/Tutorial/Progress";
import BackButton from "@/src/components/ui/BackButton";
import Icon from "@/src/components/ui/Icon/Icon";

import { Lesson } from "@/src/lib/getCourses";
import { PAGES } from "@/src/utils/constant";

type PropTypes = {
  id: string;
  lessonId: string;
  data: Lesson | null;
};

// TODO tests
// TODO homework
// TODO materials
// TODO logic
const LessonPage: FC<PropTypes> = ({ id, lessonId, data }) => {
  return (
    <div className="lesson-page">
      <div className="lesson-page__container">
        <BackButton
          label="Вернуться к курсу"
          url={PAGES.COURSE.replace(":id", id)}
          className="lesson-page__back-button"
        />

        <div className="lesson-page__lesson">
          <div className="lesson-page__lesson-zone">
            <video
              controls
              playsInline
              poster={""}
              preload="metadata"
              className="lesson-page__video"
            >
              <source src="https://placeholdervideo.dev/1920x1080" type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>

            <div className="lesson-page__lesson-content">
              <p className="lesson-page__lesson-content_title">Содержание курса:</p>

              <CourseProgress
                progress={0}
                total={10}
                className="lesson-page__lesson-content_progress"
              />

              <TutorialList
                className="lesson-page__lesson-content_list"
                isHideButton={true}
                list={[
                  {
                    id: 1,
                    title: "Урок 1",
                    duration: "10 минут",
                    test_result: 67,
                    status: "done",
                  },
                  {
                    id: 2,
                    title: "Урок 2",
                    duration: "10 минут",
                    test_result: null,
                    status: "active",
                  },
                  {
                    id: 3,
                    title: "Урок 3",
                    duration: "10 минут",
                    test_result: null,
                    status: "disabled",
                  },
                  {
                    id: 4,
                    title: "Урок 4",
                    duration: "10 минут",
                    test_result: null,
                    status: "disabled",
                  },
                  {
                    id: 5,
                    title: "Урок 5",
                    duration: "10 минут",
                    test_result: null,
                    status: "disabled",
                  },
                ]}
              />
            </div>
          </div>

          <div className="lesson-page__lesson-info">
            <div className="lesson-page__lesson-info_first">
              <p className="lesson-page__lesson-info_first-label">Урок {data?.number}</p>
              <p className="lesson-page__lesson-info_first-duration">
                <Icon name="clock" />

                <span>{data?.duration_minutes} минут</span>
              </p>
            </div>

            <div className="lesson-page__lesson-info_second">
              <p className="lesson-page__lesson-info_second-title">{data?.title}</p>
              <p className="lesson-page__lesson-info_second-description">
                Курс: {data?.course.title}
              </p>
            </div>

            <div className="lesson-page__lesson-info_buttons">
              {[
                {
                  text: "Материалы урока",
                  icon: "download",
                  isDisabled: false,
                },
                {
                  text: "Домашнее задание",
                  icon: "homework",
                  isDisabled: true,
                },
              ].map((item) => (
                <div key={item.text} className="lesson-page__lesson-info_buttons-item">
                  <p>{item.text}</p>

                  <button disabled={item.isDisabled}>
                    <Icon name={item.icon} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
