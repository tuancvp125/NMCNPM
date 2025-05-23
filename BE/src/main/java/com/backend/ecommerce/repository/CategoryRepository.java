package com.backend.ecommerce.repository;

import com.backend.ecommerce.model.Category;
import com.backend.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
