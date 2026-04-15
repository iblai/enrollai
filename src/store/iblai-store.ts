
/**
 * ibl.ai Redux store.
 *
 * This standalone store holds the RTK Query API cache and (optionally)
 * chat / file‑upload slices. Import and wrap your app with:
 *
 *   import { iblaiStore } from "@/store/iblai-store";
 *   <Provider store={iblaiStore}>…</Provider>
 *
 * If you already have a Redux store, merge the reducers and middleware
 * from this file into yours instead.
 */

import { configureStore } from "@reduxjs/toolkit";
import {
  coreApiSlice,
  mentorReducer,
  mentorMiddleware,
} from "@iblai/iblai-js/data-layer";
import {
  chatSliceReducerShared,
  filesReducer,
} from "@iblai/iblai-js/web-utils";
import { careerApiSlice } from "@/services/career-api";
import { mentorMetadataApiSlice } from "@/services/mentor-metadata-api";

export const iblaiStore = configureStore({
  reducer: {
    // Core API cache (auth, tenant, user metadata, etc.)
    [coreApiSlice.reducerPath]: coreApiSlice.reducer,

    // Career API (resume uploads)
    [careerApiSlice.reducerPath]: careerApiSlice.reducer,

    // Mentor metadata API (application progress persistence)
    [mentorMetadataApiSlice.reducerPath]: mentorMetadataApiSlice.reducer,

    // Mentor/chat API slices
    ...mentorReducer,

    // Shared chat state (messages, streaming, sessions)
    chatSliceShared: chatSliceReducerShared,

    // File upload state
    files: filesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(coreApiSlice.middleware)
      .concat(careerApiSlice.middleware)
      .concat(mentorMetadataApiSlice.middleware)
      .concat(...mentorMiddleware),
});

export type IblaiRootState = ReturnType<typeof iblaiStore.getState>;
export type IblaiAppDispatch = typeof iblaiStore.dispatch;
