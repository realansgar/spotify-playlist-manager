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
    inputs: [{ id: "source", type: "source" }]
  },
  {
    id: "name_match",
    label: "Song name matches",
    inputs: [{ id: "match_string", label: "substring or regex", type: "text" }]
  },
  {
    id: "duration_ms",
    label: "Song length",
    inputs: [
      { id: "min", label: "minimum length", type: "number", min: 0 },
      { id: "max", label: "maximum length", type: "number", min: 0 }
    ]
  },
  {
    id: "popularity",
    label: "Song popularity",
    inputs: [
      {
        id: "min",
        label: "minimum popularity",
        type: "number",
        min: 0,
        max: 100
      },
      {
        id: "max",
        label: "maximum popularity",
        type: "number",
        min: 0,
        max: 100
      }
    ]
  }
];

const state = {
  availableSources,
  availableFilters,
  sources: [{ _id: Date.now() }],
  filters: [{ _id: Date.now(), source: {} }]
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
    state.filters.push({ _id: Date.now(), source: {} });
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
