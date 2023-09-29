import React from 'react';
import {AsButton} from '@adserve/adserve-react-components';
// import propTypes from 'prop-types'

export default{
    title: 'CRM/Button',
    component: AsButton,

    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'centered',
    },

    tags: ['autodocs'],

}

const Template = (arg) =>  <AsButton {...arg}/>

export const Default = Template.bind({});

Default.args = {
    children : 'kill me'
}


// AsSearchBar.propTypes = {
//     onSearchUpdate: propTypes.func.isRequired,
//     id: propTypes.string,
//     width: propTypes.any,
//     height: propTypes.any,
//     placeholder: propTypes.string,
//     minSearchLength: propTypes.number,
//     maxLength: propTypes.number,
//     currentSearchTerm: propTypes.string,
//     containerStyle: propTypes.object
//   };


