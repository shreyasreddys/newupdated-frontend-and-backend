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
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class OrderController {

    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorMessage("Order items cannot be empty"));
        }

        List<OrderItem> orderItems = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Order order = Order.builder()
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
