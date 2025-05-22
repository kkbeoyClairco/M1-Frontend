import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { SubMenus } from './types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHouseUser } from '@fortawesome/free-solid-svg-icons';

const MenuItemLink = ({ item, className }: SubMenus) => {
    return (
        <Link
            to={{ pathname: item.url }}
            target={item.target}
            className={classNames(
                'd-flex justify-content-start align-items-center side-nav-link-ref',
                'side-sub-nav-link',
                className
            )}
            data-menu-key={item.key}
            style={{
                color: '#333333',
            }}>
            {/* <FontAwesomeIcon icon={faHouseUser} style={{ color: 'lightgray' }} /> */}
            {item.icon && <i className={item.icon}></i>}
            {/* {item.badge && (
                <span
                    className={classNames('badge', 'bg-' + item.badge.variant, 'rounded', 'font-10', 'float-end', {
                        'text-dark': item.badge.variant === 'light',
                        'text-light': item.badge.variant === 'dark' || item.badge.variant === 'secondary',
                    })}>
                    {item.badge.text}
                </span>
            )} */}
            <span>
                <h5 className="my-1 fs-5" style={{}}>
                    {' '}
                    {item.label}{' '}
                </h5>
            </span>
        </Link>
    );
};

export default MenuItemLink;
