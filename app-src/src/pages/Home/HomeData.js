
const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const LegendParams = [
    { title: 'Created', colour: '#FDB001' },
    { title: 'Closed', colour: '#000000' }
];

export const XAxis = (startMonth = -1, lenght = 12) => {
    const d = new Date();
    const MonthLabels = [];
    let iMonth = startMonth !== -1 ? startMonth - 1 : d.getMonth();
    for (let i = 0; i < lenght; i++) {
        const monthLabel = Months[iMonth];
        MonthLabels.push(monthLabel);
        if (iMonth < 11) {
            iMonth += 1;
        } else {
            iMonth = 0;
        }
    }
    return MonthLabels;
};

export const FunnelKey = 'status';
