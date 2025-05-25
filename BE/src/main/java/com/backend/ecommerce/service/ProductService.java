package com.backend.ecommerce.service;


import com.backend.ecommerce.model.Category;
import com.backend.ecommerce.model.Product;
import com.backend.ecommerce.repository.CategoryRepository;
import com.backend.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();

    }
    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product id: " + id));
    }
    public Product addProduct(Product product, Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    product.setCategory(category);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new IllegalArgumentException("Invalid category id: " + categoryId));
    }
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<Product> searchProductsByName(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
    public List<Product> searchProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product updateProduct(Product product, long categoryId) {
        Product existingProduct = productRepository.findById(product.getId()).orElse(null);
        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setQuantity(product.getQuantity());
            existingProduct.setColor(product.getColor());
            existingProduct.setSize(product.getSize());
            existingProduct.setMaterial(product.getMaterial());
            existingProduct.setProductCondition(product.getProductCondition());
            existingProduct.setImage_1(product.getImage_1()!=null? product.getImage_1() : existingProduct.getImage_1());
            existingProduct.setImage_2(product.getImage_2()!=null? product.getImage_2() : existingProduct.getImage_2());
            existingProduct.setImage_3(product.getImage_3()!=null? product.getImage_3() : existingProduct.getImage_3());
            existingProduct.setImage_4(product.getImage_4()!=null? product.getImage_4() : existingProduct.getImage_4());
            existingProduct.setImage_5(product.getImage_5()!=null? product.getImage_5() : existingProduct.getImage_5());
            Category category = categoryRepository.findById(categoryId).orElse(null);
            if (category != null) {
                existingProduct.setCategory(category);
            }

            productRepository.save(existingProduct);
        }
        return existingProduct;
    }
    public List<Product> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product id: " + productId));

        List<Product> relatedProducts = new ArrayList<>();

        if (product.getCategory() != null) {
            List<Product> productsInCategory = productRepository.findByCategoryId(product.getCategory().getId());
            for (Product p : productsInCategory) {
                if (!p.getId().equals(productId)) {
                    relatedProducts.add(p);
                }
                if (relatedProducts.size() == 5) {
                    break;
                }
            }
        }

        return relatedProducts;
    }
    public Product updateProductQuantity(Long productId, int quantity) {
        // Tìm sản phẩm theo ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product id: " + productId));
        // Cập nhật số lượng
        product.setQuantity(quantity);
        return productRepository.save(product); // Lưu lại thay đổi
    }

    public List<Map<String, Object>> getAllProductBQuantities() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> Map.<String, Object>of(
                        "id", product.getId(),
                        "name", product.getName(),
                        "b_quantity", product.getB_quantity()
                ))
                .toList();
    }


    public Integer getProductBQuantityById(Long productId) {
        return productRepository.findById(productId)
                .map(Product::getB_quantity)
                .orElse(null);
    }


}
