import React from 'react';
import { AsTab, AsTabContainer } from '@adserve/adserve-react-components';
import { action } from '@storybook/addon-actions'; 

var globalTabsList = ['OneGlobal', 'TwoGlobal']

export default {
    title: 'AdserveCRM/TabContainer', 
    component: AsTabContainer, 

    parameters: {
        // Optional parameter to center the component in the Canvas. 
        layout: 'centered',
    },

    tags: ['autodocs'],
        // Docs code
    argTypes: {
        tabElementStyle: {
            description: 'Style for tab elements',
            control: 'object',
            table: {
                type: { summary: 'object' },
            },
        },

        tabTextStyle: {
            description: 'Style for tab text',
            control: 'object',
            table: {
                type: { summary: 'object' },
            },
        },

        activeTabTextStyle: {
            description: 'Style for active tab text',
            control: 'object',
            table: {
                type: { summary: 'object' },
            },
        },

        tabPanelStyle: {
            description: 'Style for tab panels',
            control: 'object',
            table: {
                type: { summary: 'object' },
            },
        },

        onTabClick: {
            description: 'Function to handle tab clicks',
            control: null,
            table: {
                type: { summary: 'func' },
            }, 
        },

        children: {
            name: 'TabsObjects',
            description: 'Tab content elements (prop title is label of tab)',
            control: {
                type: 'array',
                separator: ',',
            },
            table: {
                type: {
                    summary: 'Array of AsTab components',
                    detail: 'Provide your AsTab components as a comma-separated list.(Do not edit! Use Tabs argument.)',
                },
                defaultValue: {
                    summary: '[]',
                },
            },
        },

        initalTab: {
            description: 'Which tab is active when component is rendered (start from 0)',
            control: 'number',
            table: {
                type: { summary: 'number' },
            },
        },

        flexTabsDivStyle: {
            description: 'Style for the div containing tab elements',
            control: 'object',
            table: {
                type: { summary: 'object' },
            },
        },

        tabsList:{
            name: 'Tabs',
            description: 'Tab content elements',
            control: {
                type: 'array',
                separator: ',',
            },
            table: {
                type: {
                    summary: 'Array of AsTab tittles',
                    detail: 'Provide your AsTab components title as a comma-separated list.',
                },
                defaultValue: {
                    summary: '[]',
                },
            },
        },
    },
};

const TabContainerTemplate = (args) => <AsTabContainer {...args} />;

export const TabContainer = TabContainerTemplate.bind({});
TabContainer.args = {
    tabElementStyle: {}, 
    tabTextStyle: {}, 
    activeTabTextStyle: {}, 
    tabPanelStyle: {}, 
    children: [
        <AsTab title='All Accounts' />,
        <AsTab title='My Accounts' />,
        <AsTab title='Recently Viewed' />,
        <AsTab title='Favourites' />
    ],
    onTabClick: (tabIndex) => {
        const tabNames = TabContainer.args.children.map((child) => child.props.title);
        action(`Tab Clicked: ${tabNames[tabIndex]}, TabIndex`)(tabIndex);
    },
    initalTab: 0, 
    flexTabsDivStyle: {}, 
};


export const ExampleContainer = TabContainerTemplate.bind({});
ExampleContainer.args = {
    tabElementStyle: {}, 
    tabTextStyle: { fontSize: '15px' }, 
    activeTabTextStyle: {
        fontSize: '20px',
        textDecoration: 'underline' 
    }, 
    tabPanelStyle: {}, 
    // children: [
    //     <AsTab title='Tab1' />,
    //     <AsTab title='Tab2' />,
    //     <AsTab title='Tab3' />,
    // ],
    onTabClick: (tabIndex) => {
        const tabNames = ExampleContainer.args.children.map((child) => child.props.title);
        action(`Tab Clicked: ${tabNames[tabIndex]}, TabIndex`)(tabIndex);
    },
    initalTab: 0, 
    flexTabsDivStyle: {}, 
    tabsList: globalTabsList, 
    children: globalTabsList.map((title) => <AsTab title={title} />),
};
