package com.example.order_service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class OrderController {

    private final OrderRepository orderRepository;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Order items cannot be empty"));
        }

        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                System.err.println("Warning: Failed to parse JWT token in order creation: " + e.getMessage());
            }
        }

        List<OrderItem> orderItems = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Order order = Order.builder()
                .username(username)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(request.getTotalAmount())
                .status("PENDING")
                .orderDate(LocalDateTime.now())
                .items(orderItems)
                .build();

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorMessage("Missing or invalid Authorization header"));
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtService.extractUsername(token);
            List<Order> orders = orderRepository.findByUsernameOrderByOrderDateDesc(username);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorMessage("Failed to parse token: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        long count = orderRepository.count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", count);
        return ResponseEntity.ok(stats);
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderRequest {
        private List<ItemRequest> items;
        private Double totalAmount;
        private String shippingAddress;
        private String paymentMethod;

        @Data
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class ItemRequest {
            private Long productId;
            private Integer quantity;
        }
    }

    @Data
    @AllArgsConstructor
    private static class ErrorMessage {
        private String message;
    }
}
