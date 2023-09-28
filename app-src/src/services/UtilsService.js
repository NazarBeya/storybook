import { InputStatusColors, InputStatusBGColors, CampaignGoalEnum } from '../constants/Enums';
import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber'; // More details https://www.npmjs.com/package/google-libphonenumber

/**
 * Validates email address
 * @param {string} email - email to validate
 */
export const IsValidEmail = (email) => {
    const validEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = validEmail.test(email);
    return valid;
};

export const IsValidMobile = (mobile) => {
    const isNumber = /^[0-9+()\-\s]*$/i.test(mobile);
    if (isNumber) {
        const phoneUtil = PhoneNumberUtil.getInstance();
        try {
            const number = phoneUtil.parse(mobile, 'GB');

            if (
                phoneUtil.isValidNumber(number) &&
                (phoneUtil.getNumberType(number) === -1 ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.MOBILE ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.FIXED_LINE_OR_MOBILE ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.UAN ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.PREMIUM_RATE)
            ) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return false;
};

export const IsValidLandline = (landline) => {
    const isNumber = /^[0-9+()\-\s]*$/i.test(landline);
    if (isNumber) {
        const phoneUtil = PhoneNumberUtil.getInstance();
        try {
            const number = phoneUtil.parse(landline, 'GB');

            if (
                phoneUtil.isValidNumber(number) &&
                (phoneUtil.getNumberType(number) === -1 ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.FIXED_LINE ||
                    phoneUtil.getNumberType(number) === PhoneNumberType.FIXED_LINE_OR_MOBILE)
            ) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return false;
};

/**
 * Validates contact number (mobile / landline)
 * @param {string} num - contact number to validate
 */
export const IsValidContactNumber = (num) => IsValidMobile(num) || IsValidLandline(num);

export const DefaultInputStatus = () => {
    return {
        statusMessage: undefined,
        statusColor: InputStatusColors.DEFAULT,
        statusBGColor: InputStatusBGColors.DEFAULT
    };
};

export const SuccessInputStatus = (statusMsg) => {
    return {
        statusMessage: statusMsg,
        statusColor: InputStatusColors.GREEN,
        statusBGColor: InputStatusBGColors.GREEN
    };
};

export const ErrorInputStatus = (statusMsg) => {
    return {
        statusMessage: statusMsg,
        statusColor: InputStatusColors.RED,
        statusBGColor: InputStatusBGColors.RED
    };
};

export const campaignStationsArrayToDictionary = (stationsArray) => {
    const stationsDictionary = {};

    for (const i in stationsArray) {
        stationsDictionary[stationsArray[i].id] = stationsArray[i];
    }

    return stationsDictionary;
};

export const campaignStationsDictionaryToArray = (stationsDictionary) => {
    const stationKeys = Object.keys(stationsDictionary);
    const stationsArray = [];

    for (let i = 0; i < stationKeys.length; i++) {
        stationsArray.push(stationsDictionary[stationKeys[i]]);
    }

    return stationsArray;
};

export const getCampaignGoalDefaults = () => {
    return [
        { goal: CampaignGoalEnum.BUDGET, value: '', selected: true },
        { goal: CampaignGoalEnum.SPOTS, value: '', selected: false },
        { goal: CampaignGoalEnum.BASE, value: '', selected: false },
        { goal: CampaignGoalEnum.BASEREACH, value: '', selected: false },
        { goal: CampaignGoalEnum.TARGETREACH, value: '', selected: false },
        { goal: CampaignGoalEnum.TARGET, value: '', selected: false },
        { goal: CampaignGoalEnum.BASEOTH, value: '', selected: false },
        { goal: CampaignGoalEnum.TARGETOTH, value: '', selected: false },
        { goal: CampaignGoalEnum.OVERALLBASEOTH, value: '', selected: false },
        { goal: CampaignGoalEnum.OVERALLTARGETOTH, value: '', selected: false }
    ];
};

// Turns Reach goal into Base Reach/Target Reach - this is handling that we can remove once everyone has a new campaign to work with since 14 May
export const formatGoal = (campaignGoal) => {
    const updatedGoal = campaignGoal;
    const reachIdx = campaignGoal.findIndex((g) => g.goal === 'reach');
    if (reachIdx !== -1) {
        updatedGoal.splice(reachIdx, 0, {
            goal: CampaignGoalEnum.BASEREACH,
            value: '',
            selected: false
        });
        updatedGoal.splice(reachIdx + 1, 0, {
            goal: CampaignGoalEnum.TARGETREACH,
            value: '',
            selected: false
        });
        updatedGoal.splice(reachIdx + 2, 1);
    }

    // Need a method to add the missing goals to older campaigns without overwriting any values, at least while still using the older stuff
    if (campaignGoal.findIndex((g) => g.goal === 'budget') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.BUDGET,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'spotsPerWeek') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.SPOTS,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'baseReach') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.BASEREACH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'targetReach') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.TARGETREACH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'weeklyBaseOTH') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.BASEOTH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'weeklyTargetOTH') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.TARGETOTH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'overallBaseOTH') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.OVERALLBASEOTH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'overallTargetOTH') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.OVERALLTARGETOTH,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'baseImpacts') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.BASE,
            selected: false,
            value: ''
        });
    }
    if (campaignGoal.findIndex((g) => g.goal === 'targetImpacts') === -1) {
        updatedGoal.push({
            goal: CampaignGoalEnum.TARGET,
            selected: false,
            value: ''
        });
    }

    if (campaignGoal.findIndex((g) => g.selected) === -1) {
        campaignGoal[campaignGoal.findIndex((g) => g.goal === 'budget')].selected = true;
    }

    return updatedGoal;
};

export const generateMonthlyPoNumbers = (startDate, endDate, currentNumbers = []) => {
    const dateFrom = new Date(startDate);
    const dateTo = new Date(endDate);
    const startYear = dateFrom.getFullYear();
    const endYear = dateTo.getFullYear();
    const startMonth = dateFrom.getMonth();
    const endMonth = dateTo.getMonth();

    const campaignCalendarMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    const iterableDate = new Date(dateFrom.setMonth(dateFrom.getMonth() - 1));
    const monthlyPoNumbers = []; // currentNumbers;

    if (campaignCalendarMonths < currentNumbers.length) {
        monthlyPoNumbers.splice(campaignCalendarMonths);
    }

    iterableDate.setMonth(iterableDate.getMonth() + currentNumbers?.length);

    for (let i = 0; i < campaignCalendarMonths; i++) {
        const currentDate = new Date(startYear, startMonth + i, 1);

        const vl = currentNumbers[i]?.poNumber;
        monthlyPoNumbers.push({
            dateText: `${currentDate.toString().substring(4, 7)} ${currentDate.toString().substring(11, 15)}`,
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + 1, 0, 0, 0, 0),
            poNumber: vl
        });
    }

    return monthlyPoNumbers;
};

export const sanitiseGoal = (campaignGoal) => {
    const updatedGoal = campaignGoal;
    for (let i = 0; i < campaignGoal?.length; i++) {
        // eslint-disable-next-line no-prototype-builtins
        if (campaignGoal[i].hasOwnProperty('Goal')) {
            campaignGoal[i].goal = campaignGoal[i].Goal;
            delete campaignGoal[i].Goal;
        }

        // eslint-disable-next-line no-prototype-builtins
        if (campaignGoal[i].hasOwnProperty('Value')) {
            campaignGoal[i].value = campaignGoal[i].Value;
            delete campaignGoal[i].Value;
        }

        // eslint-disable-next-line no-prototype-builtins
        if (campaignGoal[i].hasOwnProperty('Selected')) {
            campaignGoal[i].selected = campaignGoal[i].Selected;
            delete campaignGoal[i].Selected;
        }
    }

    return updatedGoal;
};
