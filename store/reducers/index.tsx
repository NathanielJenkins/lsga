import { combineReducers } from "redux";
import { feedReducer } from "./feed.reducer";
import { storiesReducer } from "./stories.reducer";
import { gardenReducer } from "./garden.reducer";
export const rootReducer = combineReducers({
  feed: feedReducer,
  stories: storiesReducer,
  gardens: gardenReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
