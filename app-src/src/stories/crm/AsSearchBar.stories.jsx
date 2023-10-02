import React from 'react';
import {AsSearchBar} from '@adserve/adserve-react-components';
import { action } from '@storybook/addon-actions';

export default{
    title: 'AdserveCRM/Search',
    component: AsSearchBar,

    parameters: {
        // Optional parameter to center the component in the Canvas. 
        layout: 'centered',
    },

    tags: ['autodocs'],
    // Docs code
    argTypes: {
        id:{
            description: 'Id of search bar',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'searchBar' },
            }
        },
        placeholder:{
            description: 'Placeholder text for search bar',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Search ...' },
            }
        },
        width: {
            description: 'Width of searchbar',
            table: {
                type: { summary: 'any' },
                defaultValue: { summary: 395 },
            }
        },
        height: {
            description: 'Height of searchbar',
            table: {
                type: { summary: 'any' },
                defaultValue: { summary: 42 },
            }
        },
        minSearchLength: {
            description: 'Minimum number of characters to start the search',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 3 },
            }
        },
        maxLength: {
            description: 'Maximum number of characters in search field',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 25 },
            }
        },
        currentSearchTerm: {
            description: 'This parameter determines what will be in the search field when the component is rendered', 
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
            }
        },
        onSearchUpdate: {
            description: 'A function that will be called if the search text is changed (the number of characters must be greater than "minSearchLength")', 
            table: {
                type: { summary: 'func.isRequired' },
                defaultValue: { summary: '-' },
            },
            control: {
                type: null, 
            },
        },
        containerStyle: {
            description: 'CSS styles for container of search bar', 
            table: {
                type: { summary: 'object' },
                defaultValue: { summary: '-' },
            },
        },
    },
}

//CRM sample code
const Template = (arg) =>  <AsSearchBar {...arg}/>

export const CrmSearch = Template.bind({});

CrmSearch.args = {
    id: 'accountSearch',
    placeholder: 'Search Accounts...',
    width: 395,
    height: 42,
    minSearchLength: 3,
    maxLength: 25,
    currentSearchTerm: '',
    onSearchUpdate: action('onSearchUpdate-action'),
}

export const ExampleSearch = Template.bind({});

ExampleSearch.args = {
    id: 'accountSearch',
    placeholder: 'Search Me...',
    width: 600,
    height: 68,
    minSearchLength: 4,
    maxLength: 50,
    currentSearchTerm: 'What If',
    onSearchUpdate: action('onSearchUpdate-action'),
    containerStyle: { border: '3px solid black' }
}




