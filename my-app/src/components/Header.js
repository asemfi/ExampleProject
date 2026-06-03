import Reach from 'react';

function Header() {
    return (
        <div className='page'>
            <h1>Star Wars Universe Lookup</h1>
            <span className='nowrap'>
                {/* <h3>Who are you looking for?</h3>
                (Regular expressions are cool here) */}
            </span>
        </div>
    );
}

export default Header;