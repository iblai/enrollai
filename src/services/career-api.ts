/**
 * RTK Query API slice for the ibl.ai Career / Resume endpoints.
 *
 * Endpoints live on the DM service:
 *   GET/PUT/POST  /api/career/resume/orgs/{org}/users/{username}/
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import iblConfig from "@/lib/iblai/config";

interface ResumeFile {
  name: string;
  url: string;
  type?: string;
}

interface ResumeLink {
  url: string;
}

export interface UserResumeResponse {
  id: number;
  user: number;
  platform: string;
  files?: ResumeFile[];
  links?: ResumeLink[];
}

interface ResumeQueryArgs {
  org: string;
  username: string;
}

interface ResumeMutationArgs {
  org: string;
  username: string;
  resume: FormData;
  method?: "PUT" | "POST";
}

export const careerApiSlice = createApi({
  reducerPath: "careerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("dm_token");
        if (token) {
          headers.set("Authorization", `Token ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["user-resume"],
  endpoints: (builder) => ({
    getUserResume: builder.query<UserResumeResponse, ResumeQueryArgs>({
      query: ({ org, username }) => ({
        url: `${iblConfig.dmUrl()}/api/career/resume/orgs/${org}/users/${username}/`,
        method: "GET",
      }),
      providesTags: ["user-resume"],
    }),
    createUserResume: builder.mutation<UserResumeResponse, ResumeMutationArgs>({
      query: ({ org, username, resume, method = "PUT" }) => ({
        url: `${iblConfig.dmUrl()}/api/career/resume/orgs/${org}/users/${username}/`,
        method,
        body: resume,
      }),
      invalidatesTags: ["user-resume"],
    }),
  }),
});

export const {
  useGetUserResumeQuery,
  useCreateUserResumeMutation,
} = careerApiSlice;
