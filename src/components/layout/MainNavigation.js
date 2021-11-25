import { Link } from 'react-router-dom';
import LoginButton from '../UI/LoginButton';
import LogoutButton from '../UI/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';



import classes from './MainNavigation.module.css';

function MainNavigation() {

    const { isLoading } = useAuth0();

    if (isLoading) return <div>Loading...</div>

    return (
        <header className={classes.header}>
            <div className={classes.logo}>InvoiceApp</div>
            <nav>
                <ul>

                    {/* This is temporary to quickly switch between pages.
                        Generate Invoice will come from the client page and lead
                        to final invoice. User profile will have access to already
                        entered clients and be able to also go to generate invoice.
                        add client and user profile I will keep in Nav with Logo */}

                    <li>
                        <Link to='/'>User Profile</Link>
                    </li>

                    <li>
                        <Link to='/client'>Clients</Link>
                    </li>

                    <li>
                        <Link to='/generate-invoice'>Generate Invoice</Link>
                    </li>

                    <li>
                        <Link to='/finalize-invoice'>Final Invoice</Link>
                    </li>
                    <li>
                        <LoginButton />
                        <LogoutButton />
                    </li>

                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;