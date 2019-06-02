Nova.booting((Vue, router, store) => {
    Vue.component('index-select-depend-on', require('./components/IndexField'))
    Vue.component('detail-select-depend-on', require('./components/DetailField'))
    Vue.component('form-select-depend-on', require('./components/FormField'))
})
