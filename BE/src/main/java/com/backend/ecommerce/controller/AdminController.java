package com.backend.ecommerce.controller;

import com.backend.ecommerce.model.*;
import com.backend.ecommerce.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private  UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;
    @GetMapping("/users/get")

    public List<User> getAllUser() {
        return userService.getAllUser();
    }
    @DeleteMapping("/users/delete")
    public ResponseEntity<Void> deleteCustomerById(@RequestParam Integer id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("orders/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok().body(orders);
    }
    @PostMapping("products/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product , @RequestParam long categoryId) {
        productService.addProduct(product,categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    @PutMapping("products/update")
    public ResponseEntity<?> updateProduct(@RequestBody Product product, @RequestParam Long categoryId) {
        Product updatedProduct = productService.updateProduct(product, categoryId);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }
    @DeleteMapping("products/delete")
    public ResponseEntity<Void> deleteProduct(@RequestParam Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/category/all")
    public ResponseEntity<List<Category>> getAll() {
        List<Category> products = categoryService.getAllProductsCategories();
        return ResponseEntity.ok(products);
    }
    @PostMapping("/category/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        categoryService.addCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }
    @PutMapping("/category/update")
    public ResponseEntity<Category> updateCategory(@RequestParam Long id, @RequestBody Category category) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/category/delete")
    public ResponseEntity<Void> deleteProductCategory(@RequestParam Long categoryId) {
        categoryService.deleteCategoryById(categoryId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/orders/current-month")
    public ResponseEntity<List<Order>> getOrdersInCurrentMonth() {
        List<Order> orders = orderService.getOrdersInCurrentMonth();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/current-week")
    public ResponseEntity<List<Order>> getOrdersInCurrentWeek() {
        List<Order> orders = orderService.getOrdersInCurrentWeek();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/last-year")
    public ResponseEntity<List<Order>> getOrdersInLastYear() {
        List<Order> orders = orderService.getOrdersInLastYear();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/update-status")
    public ResponseEntity<Order> updateOrderStatus(@RequestParam Long orderId, @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/orders/statuses")
    public ResponseEntity<List<Map<String, String>>> getOrderStatuses() {
        List<Map<String, String>> statuses = Arrays.stream(OrderStatus.values())
                .map(status -> Map.of(
                        "code", status.name(),
                        "description", status.getDescription()
                ))
                .toList();
        return ResponseEntity.ok(statuses);
    }

    @GetMapping("/products/b_quantity/all")
    public ResponseEntity<List<Map<String, Object>>> getAllProductBQuantities() {
        List<Map<String, Object>> productQuantities = productService.getAllProductBQuantities();
        return ResponseEntity.ok(productQuantities);
    }

    @GetMapping("/products/b_quantity")
    public ResponseEntity<Integer> getProductBQuantityById(@RequestParam Long productId) {
        Integer productQuantity = productService.getProductBQuantityById(productId);
        if (productQuantity == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productQuantity);
    }

}
