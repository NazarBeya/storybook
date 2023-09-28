import React from 'react';
import NavbarLink from './NavbarLink';

const NavbarLinks = ({ routes, parentIndex, handleClick, linksProps }) => {
    return (
        <>
            {routes.map(
                (r, i) =>
                    i > 0 && (
                        <NavbarLink
                            key={`navLink${i}`}
                            linkProps={linksProps}
                            index={i}
                            parentIndex={parentIndex}
                            handleClick={handleClick}
                            route={r}
                        />
                    )
            )}
        </>
    );
};

export default NavbarLinks;
