// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tab: {
      isCollapse: false
    }
  },
  mutations: {
    CollapseMenu(state) {
      state.tab.isCollapse = !state.tab.isCollapse;
    }
  },
  actions: {},
  modules: {}
});
