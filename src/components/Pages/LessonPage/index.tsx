"use client";

import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { getTime } from "@/src/components/Pages/CoursePage";
import TutorialList from "@/src/components/template-parts/Course/Tutorial/List";
import CourseProgress from "@/src/components/template-parts/Course/Tutorial/Progress";
import Test, { TestAnswers } from "@/src/components/template-parts/Test";
import BackButton from "@/src/components/ui/BackButton";
import Badge from "@/src/components/ui/Badge";
import Chat from "@/src/components/ui/Chat/Chat";
import Icon from "@/src/components/ui/Icon/Icon";

import { Lesson, LessonTestBody } from "@/src/lib/getCourses";
import { useAppSelector } from "@/src/store/hooks";
import { getLessonTestRequest, sendTestAnswersRequest } from "@/src/store/slices/lesson";
import { PAGES } from "@/src/utils/constant";

type PropTypes = {
  id: string;
  lessonId: string;
  data: Lesson | null;
};

// TODO tests
// TODO download homework and materials
const LessonPage: FC<PropTypes> = ({ id, lessonId, data }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isTestLoading, test, result, review } = useAppSelector((state) => state.lesson);

  console.log(data, review, test, result);

  const handleStartTestClick = useCallback(() => {
    if (id && lessonId) {
      dispatch(getLessonTestRequest({ coursePk: Number(id), lessonPk: Number(lessonId) }));
    }
  }, [id, lessonId, dispatch]);

  const handleUrlClick = useCallback(
    (itemId: number | null) => {
      if (!itemId) return;

      router.push(PAGES.LESSON.replace(":id", id).replace(":lessonId", itemId.toString()));
    },
    [id]
  );

  const handleNextLessonClick = useCallback(() => {
    if (id && lessonId) {
      // router.push(PAGES.LESSON.replace(":id", id).replace(":lessonId", (Number(lessonId) + 1).toString()));
    }
  }, [id, lessonId]);

  const handleSendAnswers = useCallback(
    (answers: TestAnswers) => {
      if (id && lessonId) {
        console.log(answers);

        const body: LessonTestBody = {
          answers: Object.entries(answers).map(([questionId, answerIds]) => ({
            question_id: Number(questionId),
            answer_ids: answerIds,
          })),
        };

        dispatch(
          sendTestAnswersRequest({
            coursePk: Number(id),
            lessonPk: Number(lessonId),
            body,
          })
        );
      }
    },
    [id, lessonId, dispatch]
  );

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
              <source
                src={data?.video?.video_url || data?.video?.video_file || ""}
                type="video/mp4"
              />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>

            <div className="lesson-page__lesson-content">
              <p className="lesson-page__lesson-content_title">Содержание курса:</p>

              <CourseProgress
                progress={0}
                total={data?.total_lessons ?? 0}
                className="lesson-page__lesson-content_progress"
              />

              <TutorialList
                className="lesson-page__lesson-content_list"
                isHideButton={true}
                courseId={id}
                onClick={handleUrlClick}
                list={
                  (data?.lessons || [])?.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    duration: `${lesson.duration_minutes} ${getTime(lesson.duration_minutes)}`,
                    test_result: lesson.test_result,
                    status: lesson.is_completed ? "done" : lesson.is_locked ? "disabled" : "active",
                  })) ?? []
                }
              />
            </div>
          </div>

          <div className="lesson-page__lesson-info">
            <div className="lesson-page__lesson-info_first">
              <Badge title={`Урок ${data?.number}`} />
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
                  url: data?.materials?.download_url,
                  isDisabled: !data?.materials?.has_file,
                  error: data?.materials?.empty_text,
                },
                {
                  text: "Домашнее задание",
                  icon: "homework",
                  url: data?.homework?.pdf_url,
                  isDisabled: !data?.homework?.has_file,
                  error: data?.homework?.empty_text,
                },
              ].map((item) => (
                <div key={item.text} className="lesson-page__lesson-info_buttons-item--container">
                  <div className="lesson-page__lesson-info_buttons-item">
                    <p>{item.text}</p>

                    <Link
                      href={item.url || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={item.icon === "download"}
                      className={classNames("lesson-page__lesson-info_buttons-item--button", {
                        "lesson-page__lesson-info_buttons-item--button-disabled": item.isDisabled,
                      })}
                    >
                      <button disabled={item.isDisabled}>
                        <Icon name={item.icon} />
                      </button>
                    </Link>
                  </div>

                  {!!item.error && (
                    <p className="lesson-page__lesson-info_buttons-item--error">
                      <Icon name="info-circle-outline" />
                      <span>{item.error}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Test
          data={test}
          result={result}
          review={review}
          isTestLoading={isTestLoading}
          className="lesson-page__test"
          onSendAnswers={handleSendAnswers}
          onStartTestClick={handleStartTestClick}
          onNextLessonClick={handleNextLessonClick}
          title={
            result
              ? `Тест пройден: ${result.correct_answers}/${result.total_questions}`
              : "Тест для проверки знаний"
          }
          description={
            result ? "Следующий урок открыт" : "Пройдите тест, чтобы открыть следующий урок"
          }
        />
      </div>

      <Chat />
    </div>
  );
};

export default LessonPage;
