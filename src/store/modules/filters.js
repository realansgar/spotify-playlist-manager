const availableSources = [
  {
    id: "library",
    label: "Liked Songs",
    inputs: []
  },
  {
    id: "recentTracks",
    label: "Recently Played Songs",
    inputs: [
      {
        id: "limitRecent",
        type: "number",
        label: "Amount",
        min: 0,
        max: 50,
        required: false
      }
    ]
  },
  {
    id: "topTracksOrArtists",
    label: "Top Songs or Artists",
    inputs: [
      {
        id: "typeTop",
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
        id: "timeRange",
        type: "select",
        label: "time range",
        options: [
          { label: "Short Term", id: "shortTerm" },
          { label: "Medium Term", id: "mediumTerm" },
          { label: "Long Term", id: "longTerm" }
        ],
        required: true
      },
      { id: "limitTop", type: "number", label: "Amount", min: 0, max: 50 },
      { id: "artistTop", type: "artistTop" }
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
    id: "songIn",
    label: "Song is in",
    inputs: [{ id: "source", type: "source" }]
  },
  {
    id: "nameMatch",
    label: "Song name matches",
    inputs: [{ id: "matchString", label: "substring or regex", type: "text" }]
  },
  {
    id: "durationMs",
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
