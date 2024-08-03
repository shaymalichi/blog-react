import React from 'react';

const Readme = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Store Name</h1>
            <p>My Online Store</p>

            <h2>What are you selling?</h2>
            <p>We are selling various electronics including laptops, smartphones, headphones, smartwatches, and tablets.</p>

            <h2>Additional Pages</h2>
            <ul>
                <li><strong>Change Username:</strong> Update user profile.</li>
                <li><strong>Past Purchases:</strong> View past purchase history.</li>
                <li><strong>Wishlist:</strong> Add items to wishlist for future purchases.</li>
                <li><strong>Reviews:</strong> Leave reviews for purchased items.</li>
            </ul>
            <p>To access these pages, navigate using the navbar at the top of the site. (you have to be logged in) </p>

            <h2>Challenges</h2>
            <p>Integrating the database setup for easy deployment was a bit challenging, but it has been automated for a smooth setup process.</p>

            <h2>Partner</h2>
            <p>This project was done individually.</p>

            <h2>Routes</h2>
            <h3>Routes when no user is logged in:</h3>
            <ul>
                <li><strong>/</strong> - Home page: Displays the items available in the store.</li>
                <li><strong>/login</strong> - Login page: Allows users to log in to their accounts.</li>
                <li><strong>/signup</strong> - Sign-up page: Allows new users to create an account.</li>
                <li><strong>/readme</strong> - Readme page: Displays the project description and details.</li>
            </ul>

            <h3>Routes when a regular user is logged in:</h3>
            <ul>
                <li><strong>/</strong> - Home page: Displays the items available in the store.</li>
                <li><strong>/cart</strong> - Cart page: Shows the products added to the cart.</li>
                <li><strong>/change-username</strong> - Change Username page: Allows users to change their username.</li>
                <li><strong>/user/orders</strong> - Past Orders page: Displays the user's past purchase history.</li>
                <li><strong>/user/wishlist</strong> - Wishlist page: Shows the user's wishlist items.</li>
                <li><strong>/reviews</strong> - Reviews page: Allows users to leave reviews for purchased items.</li>
                <li><strong>/logout</strong> - Logout: Logs the user out of their account.</li>
            </ul>

            <h3>Routes when admin is logged in:</h3>
            <ul>
                <li><strong>/</strong> - Home page: Displays the items available in the store.</li>
                <li><strong>/cart</strong> - Cart page: Shows the products added to the cart.</li>
                <li><strong>/admin</strong> - Admin page: Allows the admin to manage items and view user activities.</li>
                <li><strong>/add-item</strong> - Add Item page: Allows the admin to add new items to the store.</li>
                <li><strong>/logout</strong> - Logout: Logs the admin out of their account.</li>
            </ul>
        </div>
    );
}

export default Readme;
