import cmd from './cmd';

const os = window.require('os');

const switchConfigForCurrentOS = () => {
  switch ($node.process.platform) {
    case 'linux':
      return 'upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -E "state|time to empty|to full|percentage"';
    case 'darwin':
      return 'pmset -g batt | egrep "([0-9]+\%).*" -o';
    case 'win32':
      return 'WMIC Path Win32_Battery';
    default:
      return '';
  }
};

const timeToEmptyOrFull = (rawTime) => {
  const match = rawTime.match(/(\d+,?\d)/);
  const unit = rawTime.slice(match[0].length);
  let value = parseFloat(match[0].replace(',', '.'));
  if (unit === 'hours')
    value = value * 60 * 60 * 1000;
  if (unit === 'minutes')
    value = value * 60 * 1000;
  return { value, formatted: rawTime };
};

const percentage = rawPercentage => ({
  value: parseInt(rawPercentage.slice(0, -1)),
  formatted: rawPercentage
});

function parseStdOut(stdOut) {
  return stdOut.match(/[^ ]/g)
    .join('')
    .split(os.EOL)
    .reduce((obj, pos) => {
      const aux = pos.split(':');
      if (aux[0] === '')
        return obj;
      if (aux[0] === 'timetoempty' || aux[0] === 'timetofull')
        return Object.assign(obj, { [aux[0]]: timeToEmptyOrFull(aux[1]) });
      if (aux[0] === 'percentage')
        return Object.assign(obj, { [aux[0]]: percentage(aux[1]) });
      return Object.assign(obj, { [aux[0]]: aux[1] });
    }, {});
}

export default () => new Promise((resolve, reject) => cmd(switchConfigForCurrentOS()).then(res => resolve(parseStdOut(res))).catch(reject));
