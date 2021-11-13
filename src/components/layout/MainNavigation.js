import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';

function MainNavigation() {

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
                        <Link to='/client'>Add Client</Link>
                    </li>

                    <li>
                        <Link to='/generate-invoice'>Generate Invoice</Link>
                    </li>

                    <li>
                        <Link to='/finalize-invoice'>Final Invoice</Link>
                    </li>

                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;