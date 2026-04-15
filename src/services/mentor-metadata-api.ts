/**
 * RTK Query API slice for the ibl.ai Mentor Metadata endpoints.
 *
 * Used to persist application progress server-side per user per mentor:
 *   POST /api/ai/mentor/orgs/{org}/metadata/
 *   GET  /api/ai/mentor/orgs/{org}/users/{username}/metadata
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import iblConfig from "@/lib/iblai/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MetadataPayload = Record<string, any>;

interface GetMetadataArgs {
  org: string;
  username: string;
  mentorId: string;
}

interface SetMetadataArgs {
  org: string;
  mentorId: string;
  metadata: MetadataPayload;
}

export interface MentorMetadataResponse {
  metadata: MetadataPayload;
}

export const mentorMetadataApiSlice = createApi({
  reducerPath: "mentorMetadataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("axd_token");
        if (token) {
          headers.set("Authorization", `Token ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["mentor-metadata"],
  endpoints: (builder) => ({
    getMentorMetadata: builder.query<MentorMetadataResponse, GetMetadataArgs>({
      query: ({ org, username, mentorId }) => ({
        url: `${iblConfig.dmUrl()}/api/ai/mentor/orgs/${org}/users/${username}/metadata`,
        params: { mentor: mentorId },
      }),
      providesTags: ["mentor-metadata"],
    }),
    setMentorMetadata: builder.mutation<MentorMetadataResponse, SetMetadataArgs>(
      {
        query: ({ org, mentorId, metadata }) => ({
          url: `${iblConfig.dmUrl()}/api/ai/mentor/orgs/${org}/metadata/`,
          method: "POST",
          body: { mentor_id: mentorId, metadata },
        }),
        invalidatesTags: ["mentor-metadata"],
      }
    ),
  }),
});

export const { useGetMentorMetadataQuery, useSetMentorMetadataMutation } =
  mentorMetadataApiSlice;
