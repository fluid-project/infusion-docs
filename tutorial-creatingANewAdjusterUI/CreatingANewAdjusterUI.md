# Creating a New Adjuster UI #

## Decide what type of control it is ##

Based on the nature of the setting, different types of controls will be appropriate:

* checkboxes for on/off settings
* drop-down select boxes for choices
* radio buttons for choices where you want to present all choices visually
* sliders for choosing from a range of values

Some examples:

| Preference | Possible HTML element |
|------------|-----------------------|
|text size|text input, slider |
|foreground colour|select (drop-down), radio button|
|show captions|checkbox |
|language|select (drop-down)|

## Create HTML to display the adjusters ##

Once you know which type of HTML element you will be rendering, create an HTML template that will be used to render it. This will include the actual control as well as any labels, etc.

For a control involving repeated data (e.g. a drop-down or radio buttons), your HTML template should include only one of the elements, along with its label, etc. The markup that is to be repeated multiple times should be enclosed in a single containing element such as a `<div>` or `<span>`.

Some Examples

<table>
    <thead>
        <tr>
            <th>HTML element</th>
            <th>Sample Markup</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>drop-down</td>
            <td>
                ```html
                <label for="magnifier-position"></label>
                <select id="magnifier-position"></select>
                ```
            </td>
        </tr>
    </tbody>
</table>
