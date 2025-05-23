# E-Commerce Backend

This E-Commerce Application has been developed with Java and Spring Boot, with a strong focus on both security and ease of maintenance. The backend is powered by Spring Data JPA, which enables efficient interaction with a MySQL database, enabling easy management and storage of critical entities such as users, products, categories, orders, and others.

## Features

### User
- Registration & Login
- Fetch categories and products based on category
- Adding & deleting products to cart
- Ordering products & Managing address

### Admin
- Add, Update, Delete Products
- Manage Orders
- Manage User Details

## Security
The API is secured using JSON Web Tokens (JWT) handled by Auth0. To access the API, you will need to obtain a JWT by authenticating with the /login endpoint.

## Technologies
- Java 17 or above
- Spring Boot 3.0
- Maven
- MySQL
- Spring Data JPA
- Spring Security
- JSON Web Tokens (JWT)

Additionally, this e-commerce application follows RESTful API design principles, allowing for efficient and standardized communication between the front-end and back-end. The API responses are also formatted using JSON, which is a lightweight data interchange format that is easy to read and parse.

Furthermore, the use of Spring Boot and Spring Data JPA allows for rapid development and easy maintenance of the application. Spring Boot provides a variety of tools and features that simplify the development process, while Spring Data JPA abstracts away much of the boilerplate code required to interact with a database.

Overall, this e-commerce application provides a secure and efficient way to manage users, products, and orders, while also offering a straightforward and maintainable codebase.

