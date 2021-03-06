import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { DocumentInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import { MainLayout } from "../Layouts/MainLayout";
import dynamic from "next/dynamic";
import { withSession } from "../../lib/withSession";
import Error401 from "../../components/Error401";
import SeoTags from "../../components/SeoTags";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Page = dynamic(() => import("./Page"), { ssr: false });

type DocumentPageProps = {
  document: DocumentInterface;
};

export const Document: NextPage<DocumentPageProps> = ({ document }) => {
  return (
    <MainLayout css="sm:h-full">
      <SeoTags
        title={`CourseLab | Document - ${document.name || ""}`}
        description={`A shared document`}
      />
      {document ? <Page doc={document} /> : <Error401 />}
    </MainLayout>
  );
};
export const getServerSideProps: GetServerSideProps = withSession(
  async ({ query, req, locale }) => {
    const docId = typeof query.id === "string" ? query.id : "";

    try {
      const res = await axios.get(`${baseurl}/doc/${docId}`, {
        withCredentials: true,
        headers: {
          cookie: req?.headers.cookie,
        },
      });

      return {
        props: {
          user: req.user,
          document: res.data,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    } catch (error) {
      return {
        props: {
          user: undefined,
          document: null,
          ...(await serverSideTranslations(locale!, ["common", "docs"])),
        },
      };
    }
  }
);
