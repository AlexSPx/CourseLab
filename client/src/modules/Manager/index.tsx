import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import CourseDraftCard from "../../components/cards/CourseDraftCard";
import SeoTags from "../../components/SeoTags";
import { CourseInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { withSession } from "../../lib/withSession";
import { Main, MainLayout } from "../Layouts/MainLayout";

type CourseManagerTypes = {
  courses: CourseInterface[] | null;
};

export const Manager: NextPage<CourseManagerTypes> = ({ courses }) => {
  console.log(courses);

  const mapCourses = courses?.map((course) => {
    return <CourseDraftCard draft={course} key={course.name} />;
  });

  return (
    <MainLayout>
      <SeoTags
        title="CourseLab | Manager"
        description="The place to manage your courses"
      />
      <Main>
        {courses?.length ? (
          <div className="w-full flex flex-wrap">{mapCourses}</div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-2xl font-mono mt-3">There is nothing here</p>
          </div>
        )}
      </Main>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async ({ req }) => {
    try {
      const courseRes = await axios.get(`${baseurl}/course/mycourses/admin`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          courses: courseRes.data,
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          courses: null,
        },
      };
    }
  }
);