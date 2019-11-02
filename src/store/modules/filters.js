const availableSources = [
  {
    id: "library",
    label: "Liked Songs",
    inputs: []
  },
  {
    id: "recent_tracks",
    label: "Recently Played Songs",
    inputs: [
      {
        id: "limit_recent",
        type: "number",
        label: "Amount",
        min: 0,
        max: 50,
        required: false
      }
    ]
  },
  {
    id: "top",
    label: "Top Songs or Artists",
    inputs: [
      {
        id: "type",
        type: "select",
        label: "",
        options: [
          {
            label: "Songs",
            id: "tracks"
          },
          {
            label: "Artists",
            id: "artists"
          }
        ],
        required: true
      },
      {
        id: "time_range",
        type: "select",
        label: "time range",
        options: [
          { label: "Short Term", id: "short_term" },
          { label: "Medium Term", id: "medium_term" },
          { label: "Long Term", id: "long_term" }
        ],
        required: true
      },
      { id: "limit_top", type: "number", label: "Amount", min: 0, max: 50 }
    ]
  },
  {
    id: "search",
    label: "Search Spotify!",
    inputs: [{ id: "item", type: "search", label: "Search Spotify!" }]
  }
];

const availableFilters = [
  {
    id: "in",
    label: "Song is in",
    inputs: [{ id: "item", type: "source" }]
  },
  {
    id: "duration_ms",
    label: ""
  }
];

const state = {
  availableSources,
  availableFilters,
  sources: [{ _id: Date.now() }],
  filters: [{ _id: Date.now() }]
};

const getters = {
  getArrayIndex: state => (array, object) =>
    state[array].findIndex(x => x._id === object._id)
};

const mutations = {
  addEmptySource(state) {
    state.sources.push({ _id: Date.now() });
  },
  addEmptyFilter(state) {
    state.filters.push({ _id: Date.now() });
  },
  saveSource(state, { source }) {
    const index = state.sources.findIndex(x => x._id === source._id);
    state.sources.splice(index, 1, source);
  },
  saveFilter(state, { filter }) {
    const index = state.filters.findIndex(x => x._id === filter._id);
    state.filters.splice(index, 1, filter);
  },
  deleteSource(state, { source }) {
    const index = state.sources.findIndex(x => x._id === source._id);
    state.sources.splice(index, 1);
  },
  deleteFilter(state, { filter }) {
    const index = state.filters.findIndex(x => x._id === filter._id);
    state.filters.splice(index, 1);
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
