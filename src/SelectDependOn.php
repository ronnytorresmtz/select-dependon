<?php

namespace Ronnytorresmtz\SelectDependOn;

use Laravel\Nova\Fields\Field;

class SelectDependOn extends Field
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'SelectDependOn';

    /**
     * The field depend on.
     *
     * @var string
     */

     /**
     * Set the options for the select menu.
     *
     * @param  array  $options
     * @return $this
     */
    public function options($options)
    {
        return $this->withMeta([
            'options' => collect($options ?? [])->map(function ($label, $value) {
                return is_array($label) ? $label + ['value' => $value] : ['label' => $label, 'value' => $value];
            })->values()->all(),
        ]);
    }

    /**
     * Display values using their corresponding specified labels.
     *
     * @return $this
     */
    public function displayUsingLabels()
    {
        return $this->displayUsing(function ($value) {
            return collect($this->meta['options'])
                    ->where('value', $value)
                    ->first()['label'] ?? $value;
        });
    }

    public function dependOn($value, $array)
    {
        return $this->withMeta([
            'dependOn' => $value,
            'dependValues' => $array,
        ]); 
    }

}