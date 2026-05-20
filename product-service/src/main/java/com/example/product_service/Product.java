package com.example.product_service;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String weight;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    @Column(length = 500)
    private String image;

    private String deliveryTime; // e.g., "10 MINS"

    @Column(nullable = false)
    private String category; // e.g., "Electronics", "Fashion", "Grocery", "Sports", "Books"
}
