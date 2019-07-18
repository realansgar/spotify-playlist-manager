const availableSources = [
  {
    value: "library",
    label: "Liked Songs",
    inputs: []
  },
  {
    value: "recent_tracks",
    label: "Recently Played Songs",
    inputs: [
      {
        value: "limit",
        type: "number",
        label: "Amount",
        min: 0,
        max: 50,
        required: false
      }
    ]
  },
  {
    value: "top",
    label: "Top Songs or Artists",
    inputs: [
      {
        value: "type",
        type: "select",
        label: "",
        options: [
          {
            label: "Songs",
            value: "tracks"
          },
          {
            label: "Artists",
            value: "artists"
          }
        ],
        required: true
      },
      {
        value: "time_range",
        type: "select",
        label: "time range",
        options: [
          { label: "Short Term", value: "short_term" },
          { label: "Medium Term", value: "medium_term" },
          { label: "Long Term", value: "long_term" }
        ],
        required: true
      },
      { value: "limit", type: "number", label: "Amount", min: 0, max: 50 }
    ]
  },
  {
    value: "search",
    label: "Search Spotify!",
    inputs: [{ value: "item", type: "search", label: "Search Spotify!" }]
  }
];

const availableFilters = [
  {
    value: "in",
    label: "Song is in",
    inputs: [{ value: "item", type: "source" }]
  },
  {
    value: "duration_ms",
    label: ""
  }
];

const state = {
  availableSources,
  availableFilters,
  groups: []
};

const getters = {};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
