import { useTranslation } from "next-i18next";
import React from "react";
import { CourseInterface } from "../../../interfaces";
import SOJDatesRender from "./Cards/SOJDatesRender";

export default function StartOnJoin({ course }: { course: CourseInterface }) {
  const { t } = useTranslation("course_settings");
  return (
    <div className="flex flex-col w-full items-center">
      {course.weeks ? (
        <SOJDatesRender
          courseName={course.name}
          courseWeeks={course.weeks}
          t={t}
        />
      ) : (
        <h1 className="font-bold text-lg">{t("no-model")}</h1>
      )}
    </div>
  );
}
