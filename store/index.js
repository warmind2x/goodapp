export const state = ()=>({
    auth:null,
    projects:[],
});

export const mutations = {
    setAuth(state, auth) {
        state.auth = auth;
    },

    setProject(state, projects) {
      state.projects = projects;
  },
};

export const actions = {
    readToken() {
        let auth = null;
        try {
          auth = JSON.parse(localStorage.getItem("auth"));
        } catch (error) {
          console.log(err);
        }
        //saving auth in state
        this.commit("setAuth", auth);
      },

      saveProjects(){
        let projects = [];
        const axiosHeader = {
          headers: {
            token: this.state.auth.token
          }
        };
        this.$axios.get("/project", axiosHeader)
        .then((result) => {
          projects = result.data.data;
          console.log(projects);
          this.commit("setProject",projects);
          
        }).catch((err) => {
          console.log(err)
          
        });
      }
};