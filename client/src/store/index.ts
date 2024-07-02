import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        leads: []
    },
    getters: {
        leads(state) {
            return state.leads;
        }
    },
    mutations: {
        setLeads(state, payload) {
            state.leads = payload;
        }
    },
    actions: {
        async getLeads(context, payload) {
            const baseUrl = process.env.VUE_APP_BASE_URL;
            const query = payload.searchQuery;
            const { data: leads } = await axios.get(`${baseUrl}/leads?query=${query}`);

            context.commit('setLeads', leads);
        }
    }
});
