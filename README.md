# Online Store

This project is an online store application built with React for the frontend and Node.js with SQL for the backend.

### Set Up

1. ****
    - set up the local database
    ```sh
    npm run init-db
    ```
    - start the backend server
    ```sh
    npm run server
    ```
    - start the frontend
    ```sh
    npm start
    ```


## Features

### Public Routes
- **Home**: Displays all items available in the store.
- **Readme**: Provides project documentation.
- **Login**: Allows users to log in.
- **Sign Up**: Allows users to create a new account.

### User Routes
- **Home**: Displays all items available in the store.
- **Cart**: Shows items added to the cart by the user.
- **Change Username**: Allows the user to change their username.
- **Past Orders**: Shows the user's past orders.
- **Wishlist**: Displays items added to the user's wishlist.
- **Reviews**: Allows users to leave reviews for items.
- **Logout**: Logs the user out.

### Admin Routes
- **Home**: Displays all items available in the store.
- **Cart**: Shows items added to the cart by the admin (admin functionality for testing purposes).
- **Admin**: Exposes the activity (login/logout/add-to-cart) of all users and allows managing products.
- **Add Item**: Allows the admin to add new items to the store.
- **Logout**: Logs the admin out.

