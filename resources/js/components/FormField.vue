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

        let optionsToAdd = {};

        Object.keys(store).forEach(function(idx) {
            if (store[idx].dependOn !== undefined) {
                if (store[idx].field.toLowerCase() === fieldAttribute) {
                    const dependOn = store[idx].dependOn; 
                    if (store[idx].dependOn !== undefined) {
                        Object.keys(store).forEach(function(idx) {
                            if (store[idx].field === dependOn.toLowerCase()) {
                                const value = store[idx].value;
                                Object.keys(store).forEach(function(idx) {
                                    if (store[idx].dependOn !== undefined) {
                                        if (store[idx].dependOn.toLowerCase() === dependOn.toLowerCase()) {
                                            optionsToAdd = {
                                                'options': store[idx].options[value],
                                                'field': store[idx].field,
                                            };
                                        }
                                    }
                                });

                            }
                        });
                    }
                                   
                }
            }
        });

        this.addOptionsToSelect(optionsToAdd);

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

            const fieldAttribute = this.field.attribute;
            const store = Nova.store.getters.getData

            let optionsToAdd = {};
            Object.keys(store).forEach(function(idx) {
                if (store[idx].dependOn !== undefined) {
                    if (store[idx].dependOn.toLowerCase() == fieldAttribute) {
                        optionsToAdd = {
                           'options': store[idx].options[value],
                           'field': store[idx].field,
                        };
                    }
                }
            });

            this.addOptionsToSelect(optionsToAdd);
        },

        addOptionsToSelect(optionsToAdd) {
            if (! (_.isEmpty(optionsToAdd))) {
                document.getElementById(optionsToAdd.field).options.length = 1;
                var el = document.getElementById(optionsToAdd.field);
                for(var i in optionsToAdd.options) {
                    var option = document.createElement("option");
                    option.text = optionsToAdd.options[i];
                    option.label = optionsToAdd.options[i];
                    el.add(option);
                }
            }
        },

        addFieldInfoToStore() {

            Nova.store.dispatch('addSelectOption', {
                'field': this.field.attribute, 
                'value': this.field.value,
                'dependOn': this.field.dependOn,
                'options': this.field.dependValues,
            });

        }

    },
}

</script>