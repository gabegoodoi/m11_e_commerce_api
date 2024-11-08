This Repository is a mini-project for Coding Temple.

INSTALLATIONS: git clone https://github.com/gabegoodoi/11_mini_project_e_commerce_api.git

you'll need to run the following in yout IDE of choice:

cd directory_name
code .
python3 -m venv virtual_environment_name
source virtual_environment_name/bin/activate
pip install flask flask_sqlalchemy flask_marshmallow marshmallow
SQL TABLES Use MySQL and create a database (the program should make all the desired tables when run):

CREATE DATABASE e_commerce_db;

'''

RUN APPLICATION

        cd 6_mini_project_e_commerce_api
        From your IDE of choice, select the run button from the app.py file.

TABLE OF CONTENTS:

        BACK_END
            app.py
            password.py
        FRONT_END
            Components: Organized into folders for logical separation, including Customer, Product, and Order components.
            App.jsx: The root component for routing and rendering various parts of the application.
            main.jsx: The main entry point for rendering App.jsx and initializing React.
            index.html: The base HTML template.

Backend Overview

APP.PY The database runs through the app.py file. It does so by:

1st: importing the following for the following purposes:

from flask import Flask, jsonify, request
    Flask is a class instance that acts as the web application we're attempting to build here.
    jsonify is a function that converts python collections to JSON format (strings wrapped in curly braces) in a process called serialization
    request is an object of flask that can deserialize JSON formatted strings.

    
from flask_sqlalchemy import SQLAlchemy
    SQLAlchemy is a class that creates database tables, handles data storage, and relationships

from datetime import timedelta
    timedelta is a class used to tell the difference between two datetime objects
    
from flask_marshmallow import Marshmallow
    Marshmallow is a class that handles how the data stored by SQLAlchemy is presented and validated
   
from marshmallow import ValidationError, fields
    ValidationError is an error class that handles data that doesn't meet the requirements set by the schemas
    fields is a submodule that contains a bunch of predefined datatype classes that help Marshmallow handle the data of those datatypes in a formatted way

from flask_cors import CORS
    CORS allows cross origin resource sharing, meaning the flask app can be utilized by react
    
from password import mypassword
    this is the password to your MySQLWorkbench connection. You'll need to change this yourself.

2nd: initializing and running the Flask app, connecting to the database, creating an SQLAlchemy & Marshmallow object with the Flask app as it's argument, creating the defined tables that aren't already in the database.

3rd: Defining the Model classes (tables) for Customer, Product, order_product, & Order. With special importance given to setting primary keys, foreign keys, & relationships.

4th: Defining the schema classes (data structure for marshmallow) for Customers, Products, OrderView, & OrderManip and their Metas

5th: establishing the routes, their methods, and their endpoints

Front-End Overview

The frontend is built with React and organized around functional components with hooks to manage state and effects. 

Import and Setup Prerequisites:
- must create a React dev server, run something like:
    npx create-vite my-react-project --template react
    cd my-react-project
    npm install
    npm run dev
    npm install react-router-dom
    npm install react-bootstrap bootstrap

Key features and components include:

            Customer Management
                Create Customer Form: Allows adding a new customer by capturing and validating information like name, email, and phone number.
                Customer Details: Displays a customer’s details, including name, email, and phone.
                Update Customer Form: Enables editing a customer’s details with pre-filled form data based on their unique ID.
                Delete Customer Functionality: Includes a function for deleting a customer from the database, which triggers a confirmation modal.
            
            Product Catalog
                Product List: Displays a list of all available products, providing essential details such as name and price.
                Create Product Form: Adds a new product to the database, capturing product details like name and price.
                Product Details: Displays information about a specific product.
                Update Product Form: Allows users to modify product details.
                Delete Product Functionality: Supports product deletion, secured with a confirmation prompt to avoid accidental removals.

            Order Processing
                Place Order Form: Enables customers to create new orders by selecting products, specifying quantities, and providing order details.

- Components are organized for scalability, including Customer and Product directories.
- Utilizes useState for managing component state and useEffect for data fetching and updates.
- Routes are implemented with React Router, creating navigable pages for each major section, including customer, product, and order management.
- Form validation is included to enforce proper formatting and required fields.