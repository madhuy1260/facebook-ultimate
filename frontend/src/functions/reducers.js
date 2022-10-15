export function postsReducer(state, action) {
  switch (action.type) {
    case "POSTS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "POSTS_SUCCESS":
      return { ...state, loading: false, error: "", posts: action.payload };
    case "POSTS_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function profileReducer(state, action) {
  switch (action.type) {
    case "PROFILE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PROFILE_SUCCESS":
      return { ...state, loading: false, error: "", profile: action.payload };
    case "PROFILE_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function photosReducer(state, action) {
  switch (action.type) {
    case "PHOTOS_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PHOTOS_SUCCESS":
      return { ...state, loading: false, error: "", photos: action.payload };
    case "PHOTOS_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
