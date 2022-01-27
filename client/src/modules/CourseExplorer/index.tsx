import axios from "axios";
import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { dataModelType } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { MainLayout } from "../Layouts/MainLayout";
import Page from "./Page";

type CourseExplorerProps = {
  courses: CourseGeneralRawInterface[];
};

export interface CourseGeneralRawInterface {
  name: string;
  public_name: string;
  weeks: number;
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
      <Page coursesRaw={courses} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const courses = await axios.get(`${baseurl}/course/explore/null`, {
    withCredentials: true,
    headers: {
      cookie: req.headers.cookie ? req.headers.cookie : null,
    },
  });

  return {
    props: {
      courses: courses.data,
    },
  };
};
