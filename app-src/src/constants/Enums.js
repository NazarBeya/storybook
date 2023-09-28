export const InputStatusColors = {
    DEFAULT: '#D7D7D7',
    GREEN: '#45AE06',
    RED: '#C40606'
};

export const InputStatusBGColors = {
    DEFAULT: '#FFFDF4',
    GREEN: '#FFFDF4',
    RED: '#FFF3F3',
    DISABLED: '#F7F7F7'
};

export const BusinessTypes = {
    AIRTIME: { name: 'Airtime', text: 'Airtime' },
    SANDP: { name: 'SAndP', text: 'S&P' },
    OFFAIRS: { name: 'OffAirs', text: 'Off-Airs' },
    PACKAGE: { name: 'Package', text: 'Package' },
    DIGITAL: { name: 'Digital', text: 'Digital' }
};

export const GetBusinessTypeByText = (text) => {
    const businessTypeKey = Object.keys(BusinessTypes).find(
        (key) => BusinessTypes[key].text === text
    );
    return BusinessTypes[businessTypeKey];
};

export const CampaignGoalEnum = {
  BUDGET: 'budget',
  SPOTS: 'spotsPerWeek',
  TARGETREACH: 'targetReach',
  BASEREACH: 'baseReach',
  TARGETOTH: 'weeklyTargetOTH',
  BASEOTH: 'weeklyBaseOTH',
  OVERALLTARGETOTH: 'overallTargetOTH',
  OVERALLBASEOTH: 'overallBaseOTH',
  TARGET: 'targetImpacts',
  BASE: 'baseImpacts'
};
