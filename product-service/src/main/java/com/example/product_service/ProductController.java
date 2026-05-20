package com.example.product_service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS, RequestMethod.PUT, RequestMethod.DELETE})
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategoryIgnoreCase(category);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Product name cannot be empty"));
        }
        if (request.getCategory() == null || request.getCategory().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Product category cannot be empty"));
        }
        if (request.getPrice() == null || request.getPrice() <= 0) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Price must be greater than 0"));
        }

        Product product = Product.builder()
                .name(request.getName())
                .weight(request.getWeight())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .image(request.getImage())
                .deliveryTime(request.getDeliveryTime())
                .category(request.getCategory())
                .build();

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        long count = productRepository.count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", count);
        return ResponseEntity.ok(stats);
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductRequest {
        private String name;
        private String weight;
        private Double price;
        private Double originalPrice;
        private String image;
        private String deliveryTime;
        private String category;
    }

    @Data
    @AllArgsConstructor
    private static class ErrorMessage {
        private String message;
    }
}
