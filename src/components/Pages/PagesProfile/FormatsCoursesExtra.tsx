import { useEffect, useRef, useState } from "react";

import FormatsCourseItem from "@/src/components/Pages/PagesProfile/FormatsCourseItem";

import { Course } from "@/src/entities/common";

type FormatsCoursesExtraProps = {
  courses: Course[];
  isOpen: boolean;
};

const FormatsCoursesExtra = ({ courses, isOpen }: FormatsCoursesExtraProps) => {
  const contentRef = useRef<HTMLUListElement | null>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    setHeight(isOpen ? `${content.scrollHeight}px` : "0px");
  }, [isOpen, courses]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !isOpen) return;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(`${content.scrollHeight}px`);
    });

    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [isOpen, courses]);

  if (!courses.length) return null;

  return (
    <li className="children-details-page__formats_list-extra">
      <div className="children-details-page__formats_list-extra-content" style={{ height }}>
        <ul ref={contentRef} className="children-details-page__formats_list-extra-items">
          {courses.map((item) => (
            <FormatsCourseItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </li>
  );
};

export default FormatsCoursesExtra;
