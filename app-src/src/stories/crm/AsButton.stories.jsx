import React from 'react';
import {AsButton} from '@adserve/adserve-react-components';
import { action } from '@storybook/addon-actions';


export default{
    title: 'AdserveCRM/Button',
    component: AsButton,

    parameters: {
        // Optional parameter to center the component in the Canvas. 
        layout: 'centered',
    },

    tags: ['autodocs'],
    argTypes: {
        type: {
          description: 'Type of button',
          table: {
            type: { summary: 'string' },
            defaultValue: { summary: 'button' },
          },
          control: { type: 'select',},
          options: ['button', 'submit', 'reset', 'image', 'menu'],
        },
        disabled: {
          description: 'Whether the button is disabled',
          table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: false },
          },
          control: {
            type: 'boolean',
          },
        },
        useSecondaryStyle: {
          description: 'Whether to use secondary button style',
          table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: false },
          },
          control: {
            type: 'boolean',
          },
        },
        useTertiaryStyle: {
          description: 'Whether to use tertiary button style',
          table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: false },
          },
          control: {
            type: 'boolean',
          },
        },
        handleClick: {
          description: 'Function to be called when the button is clicked',
          table: {
            type: { summary: 'function' },
            defaultValue: { summary: null },
          },
          control: {
            type: null, 
          },
        },
        dataId: {
          description: 'Data ID for the button',
          table: {
            type: { summary: 'string' },
            defaultValue: { summary: '' },
          },
          control: {
            type: 'text',
          },
        },
        hoverStyle: {
          description: 'Style to apply on hover',
          table: {
            type: { summary: 'object' },
            defaultValue: { summary: null },
          },
          control: {
            type: 'object',
          },
        },
        children:{
            name: 'label',
            description: 'Button text',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '-' },
            }
        },     
      },
      args:{
        handleClick: action('handleClick-action'),
      },
}

const Template = (arg) =>  <AsButton {...arg}/>

export const CreateNew = Template.bind({});

CreateNew.args = {
    type: 'button',
    disabled: false,
    useSecondaryStyle: false,
    useTertiaryStyle: false,
    dataId: 'buttonDataId',
    hoverStyle: {
    },
    children : 'CreateNew'
}

export const TertiaryButton = Template.bind({});
TertiaryButton.args = {
  type: 'button',
  disabled: false,
  useSecondaryStyle: false,
  useTertiaryStyle: true,
  dataId: 'tertiaryButtonDataId',
  hoverStyle: {
    backgroundColor: '#ff0000', 
  },
  children : 'TertiaryButton'
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  type: 'button',
  disabled: false,
  useSecondaryStyle: true,
  useTertiaryStyle: false,
  dataId: 'secondaryButtonDataId',
  hoverStyle: {
    backgroundColor: '#00ff00', 
  },
  children : 'SecondaryButton'
};


