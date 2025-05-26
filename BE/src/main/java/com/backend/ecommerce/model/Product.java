package com.backend.ecommerce.model;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String material;
    
    @Column(nullable = true)
    private String productCondition;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Lob
    @Column(nullable = false)
    private String image_1;
    @Lob
    @Column(nullable = true)
    private String image_2;
    @Lob
    @Column(nullable = true)
    private String image_3;
    @Lob
    @Column(nullable = true)
    private String image_4;
    @Lob
    @Column(nullable = true)
    private String image_5;
    @Column(nullable = false)
    private Double price;
    @Lob
    @Column(nullable = false)
    private String description;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer quantity = 0;

    @Setter
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer b_quantity = 0;


}
