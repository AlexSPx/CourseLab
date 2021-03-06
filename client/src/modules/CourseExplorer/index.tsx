import axios from "axios";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SeoTags from "../../components/SeoTags";
import {
  CourseScheduleType,
  dataModelType,
  ScheduleDate,
} from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type CourseExplorerProps = {
  courses: CourseGeneralRawInterface[];
};

export interface CourseGeneralRawInterface {
  name: string;
  public_name: string;
  weeks: number;
  scheduleType: CourseScheduleType;
  interval?: number;
  scheduledDates: ScheduleDate[];
  details: {
    description: string;
  };
  dataModels: {
    type: dataModelType;
  }[];
}

export const CourseExplorer: NextPage<CourseExplorerProps> = ({ courses }) => {
  return (
    <MainLayout>
      <SeoTags title="CourseLab | Explore" description="Explore courses" />
      <Page coursesRaw={courses} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req, locale }) => {
    try {
      const courses = await axios.get(`${baseurl}/course/explore/null`, {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie ? req.headers.cookie : null,
          headers: {
            cookie: req?.headers.cookie,
          },
        },
      });

      return {
        props: {
          courses: courses.data,
          user: req.user || null,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    } catch (error) {
      return {
        props: {
          courses: null,
          user: req.user || null,
          ...(await serverSideTranslations(locale!, ["common"])),
        },
      };
    }
  },
  { requiresAuth: null }
);
