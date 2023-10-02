import React from 'react';
import { AsTab, AsTabContainer } from '@adserve/adserve-react-components';
import { action } from '@storybook/addon-actions'; 

export default {
  title: 'Your Component Group', 
  component: AsTabContainer, 

  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
};


const TabContainerTemplate = (args) => <AsTabContainer {...args} />;

export const TabContainer = TabContainerTemplate.bind({});
TabContainer.args = {
  tabElementStyle: {}, 
  tabTextStyle: {}, 
  activeTabTextStyle: {}, 
  tabPanelStyle: {}, 
  onTabClick: action('onTabClick'),
  children: [
        <AsTab title='All Accounts' />,
        <AsTab title='My Accounts' />,
        <AsTab title='Recently Viewed' />,
        <AsTab title='Favourites' />
  ],
  initialTab: 0, 
  flexTabsDivStyle: {}, 
};
