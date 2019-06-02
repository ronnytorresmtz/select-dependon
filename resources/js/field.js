
import Vuex from 'vuex';

Nova.booting((Vue, router, store) => {
    Vue.component('index-SelectDependOn', require('./components/IndexField'))
    Vue.component('detail-SelectDependOn', require('./components/DetailField'))
    Vue.component('form-SelectDependOn', require('./components/FormField'))

    Vue.use(Vuex);

    Nova.store = new Vuex.Store({
        state: {
            data: []
        },
        mutations: {
            ADD_SELECT_OPTION(state, data) {
                let bExist = false;
                state.data.forEach(function(item, index) {
                    if (item.field == data.field) {
                        item.value = data.value;
                        bExist = true;
                    }
                });
                if (! bExist) {
                    state.data.push(data);
                }
            }
        },

        actions: {
            addSelectOption(context, data) {
                context.commit('ADD_SELECT_OPTION', data);
              },

        },
        getters: {
            getData: state => state.data,
        },
    });

})


