const state = {
  scopes: {
    userReadRecentlyPlayed: false,
    userTopRead: false,
    userLibraryRead: false,
    userFollowRead: false,
    playlistReadPrivate: false,
    playlistReadCollaborative: false,
    playlistModifyPublic: true
  },
  clientId: "bc334213f1d743b883dabe0d47e4422e",
  baseUrl: "https://accounts.spotify.com/authorize",
  redirectUrl: "http://localhost:8080/callback.html",
  accessToken: "",
  loginModalShow: false,
  loginModalReason: ""
};

const getters = {
  authUrl: state => {
    let scopesArr = Object.keys(state.scopes).filter(x => state.scopes[x]);
    scopesArr = scopesArr.map(x =>
      x.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    );
    let params = {
      client_id: state.clientId,
      response_type: "token",
      redirect_uri: state.redirectUrl,
      scope: scopesArr.join(" ")
    };
    let url = new URL(state.baseUrl);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
    return url.toString();
  }
};

const mutations = {
  updateLoginModal(state, { show, reason } = {}) {
    state.loginModalShow = show;
    state.loginModalReason = reason || state.loginModalReason;
  },
  updateScopes(state, { key, value }) {
    state.scopes[key] = value;
  },
  setAccessToken(state, { token } = {}) {
    if (token !== undefined) {
      state.accessToken = token;
    } else {
      state.accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
    }
  }
};

export default { namespaced: true, state, getters, mutations };
