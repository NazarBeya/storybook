export const IndexByLocation = (options, pathname) => {
    return options.findIndex(
        (option) => option.path === `/${pathname.split('/')[1]}`
    ); // Split used here to work with child pages e.g. contacts/details
};
