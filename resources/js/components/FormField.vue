<template>
    <default-field :field="field" :errors="errors">
        <template slot="field">
            <select-control
                :id="field.attribute"
                :dusk="field.attribute"
                v-model="value"
                class="w-full form-control form-select"
                :class="errorClasses"
                :options="field.options"
                :disabled="isReadonly"
                @change.prevent="onClick(value)"
            >
                <option value="" selected>{{ __('Choose an option') }}</option>
            </select-control>
        </template>
    </default-field>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova'
export default {

    mixins: [HandlesValidationErrors, FormField],

    mounted() {
        this.addFieldInfoToStore();
        const store = Nova.store.getters.getData
        const fieldAttribute = this.field.attribute;
        const fieldValue = this.field.value;
        let newOptions = {};
        const self = this;
        Object.keys(store).forEach(function(idx) {
            if (store[idx].dependOn !== undefined) {
                if (store[idx].field.toLowerCase() === fieldAttribute) {
                    const dependOn = store[idx].dependOn; 
                    if (store[idx].dependOn !== undefined) {
                        Object.keys(store).forEach(function(idx) {
                            if (store[idx].field === dependOn.toLowerCase()) {
                                const value = store[idx].value;
                                const newOptions =  self.addDependFieldOptionsToSelect(store, dependOn, value);
                            }
                        });
                    }
                                   
                }
            }
        });
    },
    methods: {
        /**
         * Provide a function that fills a passed FormData object with the
         * field's internal value attribute. Here we are forcing there to be a
         * value sent to the server instead of the default behavior of
         * `this.value || ''` to avoid loose-comparison issues if the keys
         * are truthy or falsey
         */
        fill(formData) {
            formData.append(this.field.attribute, this.value)
        },
        onClick(value) {
            this.addFieldInfoToStore();
            const store = Nova.store.getters.getData
            this.addDependFieldOptionsToSelect(store, this.field.attribute, value)
        },
        addDependFieldOptionsToSelect(store, fieldName, value) {
            let newOptions = {};
            Object.keys(store).forEach(function(idx) {
                if (store[idx].dependOn !== undefined) {
                    if (store[idx].dependOn.toLowerCase() == fieldName.toLowerCase()) {
                        newOptions = {
                           'options': store[idx].options[value],
                           'field': store[idx].field,
                        };
                    }
                }
            });
            this.addOptionsToSelect(newOptions);
        },

        addOptionsToSelect(options) {
            if (! (_.isEmpty(options))) {
                this.clearSelect(options.field);
                this.createAndAddOptions(options);
            }
        },

        addFieldInfoToStore() {
            Nova.store.dispatch('addSelectOption', {
                'field': this.field.attribute, 
                'value': this.field.value,
                'dependOn': this.field.dependOn,
                'options': this.field.dependValues,
            });
        },

        clearSelect(field) {
            document.getElementById(field).options.length = 1;
        },

        createAndAddOptions(options){
            const elem = document.getElementById(options.field);
            for(const i in options.options) {
                elem.add(this.createSelectOption(options.options[i]));
            }
        },

        createSelectOption(option) {
            const newOption = document.createElement("option");
            newOption.text = option;
            newOption.label = option;
            return newOption;
        }
    },
}
</script>