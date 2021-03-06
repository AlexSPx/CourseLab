import React, { useState } from "react";
import { Main } from "../Layouts/MainLayout";
import ImageSelector from "../../components/Inputs/ImageSelector";
import axios from "axios";
import { baseurl } from "../../lib/fetcher";
import { CourseInterface } from "../../interfaces";
import CourseDraftCard from "../../components/cards/CourseDraftCard";
import { useSWRConfig } from "swr";
import useRequest from "../../lib/useRequest";
import { TFunction } from "react-i18next";

export default function Page({
  drafts,
  t,
}: {
  drafts: CourseInterface[];
  t: TFunction<"translation", undefined>;
}) {
  const [name, setName] = useState("");
  const [publicName, setPublicName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();

  const { executeQuery } = useRequest();
  const { mutate } = useSWRConfig();

  const createCourse = async () => {
    const courseData = new FormData();
    courseData.append("name", name);
    courseData.append("public_name", publicName);
    courseData.append("description", description);
    if (image) courseData.append("image", image);

    executeQuery(
      async () => {
        const res = await axios.post(`${baseurl}/course/create`, courseData, {
          withCredentials: true,
        });
        return res;
      },
      {
        loadingTitle: "Creating your course...",
        successTitle: "Course has been created",
        successBody: "A new course draft has been created",
        successStatus: 201,
        onSuccess: () => mutate(`${baseurl}/course/mydrafts`),
      }
    );
  };

  const mapDrafts = drafts?.map((draft) => {
    return <CourseDraftCard draft={draft} key={draft.name} />;
  });

  return (
    <Main css="items-center">
      <div className="divider max-w-2xl w-full italic">{t("drafts")}</div>
      <div className="flex flex-row">{mapDrafts}</div>
      <div className="divider max-w-2xl w-full italic">
        {t("create-course")}
      </div>

      <div className="flex flex-col max-w-2xl w-full md:w-3/5"></div>

      <div className="flex flex-col md:flex-row max-w-2xl w-full lg:w-3/5 items-center justify-center">
        <div className="flex flex-col relative w-56 h-32 mr-3">
          <ImageSelector
            image={image}
            setImage={setImage}
            label={t("select-image")}
            shape="square"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t("public-name")}</span>
            </label>
            <input
              type="text"
              placeholder={t("public-name")}
              value={publicName}
              className="input input-bordered"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setPublicName(e.target.value)
              }
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t("name")}</span>
            </label>
            <input
              type="text"
              placeholder={t("name")}
              value={name}
              className="input input-bordered"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                setName(e.target.value)
              }
            />
            <span className="label">
              <span className="label-text-alt flex w-full justify-between">
                <p>{t("must-be-unique")}</p>
                <p>{`htts://course-lab.xyz/course/${name}`}</p>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="form-control max-w-2xl w-full lg:w-3/5 mb-3">
        <label className="label">
          <span className="label-text">{t("description")}</span>
        </label>
        <textarea
          className="textarea h-24 textarea-bordered"
          placeholder={t("description")}
          defaultValue={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="btn max-w-2xl w-full md:w-3/5" onClick={createCourse}>
        {t("create-draft")}
      </div>
    </Main>
  );
}
