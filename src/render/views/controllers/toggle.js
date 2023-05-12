import '@ui5/webcomponents/dist/Switch';


/**
 * @typedef {object} ToggleSettings
 * @prop {object} text Text to display on the button at each state
 * @prop {string} [on=null] Default: `null` => `✓`
 * @prop {string} [off=null] Default: `null` => `-`
 * @prop {string} tooltip Blank strings will be ignored
 * @prop {boolean} graphical Changes on/off colors to gren/red and overrides text with `✓`|`x`
 */

/**
 *
 * @param {object} args
 * @param {boolean} args.value
 * @param {(value: boolean) => void} args.onChagne
 * @param {ToggleSettings} args.settings
 */
export default function toggle({
  value,
  settings: { text = {}, tooltip, graphical } = {},
  onChange,
}) {
  const toggleEl = document.createElement('ui5-switch');
  toggleEl.checked = value;

  if (graphical) {
    toggleEl.design = 'Graphical';
  } else {
    const { on = null, off = null } = text;
    if (on !== null) toggleEl.textOn = on;
    if (off !== null) toggleEl.textOff = off;
  }

  if (tooltip !== undefined && tooltip !== '') toggleEl.tooltip = tooltip;

  toggleEl.addEventListener('change', () => {
    onChange(toggleEl.checked);
  });

  return toggleEl;
}