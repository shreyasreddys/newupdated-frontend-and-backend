package com.example.product_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.List;

@SpringBootApplication
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(ProductRepository productRepository) {
		return args -> {
			if (productRepository.count() == 0) {
				System.out.println("Seeding default EquiCart products to RDS MySQL database...");

				List<Product> defaultProducts = List.of(
						// Electronics
						Product.builder()
								.name("OnePlus Nord Buds 2r")
								.weight("1 Unit")
								.price(2199.0)
								.originalPrice(2299.0)
								.image("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80")
								.deliveryTime("12 MINS")
								.category("Electronics")
								.build(),
						Product.builder()
								.name("boAt Stone 350 Speaker")
								.weight("1 Unit")
								.price(1499.0)
								.originalPrice(3490.0)
								.image("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80")
								.deliveryTime("15 MINS")
								.category("Electronics")
								.build(),
						Product.builder()
								.name("Portronics Power Bank 10000mAh")
								.weight("1 Unit")
								.price(999.0)
								.originalPrice(1999.0)
								.image("https://images.unsplash.com/photo-1609592424085-f5b22f0e0f31?w=400&q=80")
								.deliveryTime("10 MINS")
								.category("Electronics")
								.build(),

						// Fashion
						Product.builder()
								.name("Roadster Men Casual Shirt")
								.weight("M Size")
								.price(699.0)
								.originalPrice(1499.0)
								.image("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80")
								.deliveryTime("25 MINS")
								.category("Fashion")
								.build(),
						Product.builder()
								.name("Puma Unisex Cap")
								.weight("Free Size")
								.price(499.0)
								.originalPrice(999.0)
								.image("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80")
								.deliveryTime("20 MINS")
								.category("Fashion")
								.build(),

						// Grocery
						Product.builder()
								.name("Amul Pasteurised Butter")
								.weight("500 g")
								.price(275.0)
								.originalPrice(285.0)
								.image("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80")
								.deliveryTime("8 MINS")
								.category("Grocery")
								.build(),
						Product.builder()
								.name("Britannia Good Day Biscuits")
								.weight("200 g")
								.price(30.0)
								.originalPrice(40.0)
								.image("https://images.unsplash.com/photo-1558961312-503453e50a4b?w=400&q=80")
								.deliveryTime("9 MINS")
								.category("Grocery")
								.build(),
						Product.builder()
								.name("Lay's Classic Salted Chips")
								.weight("50 g")
								.price(20.0)
								.originalPrice(20.0)
								.image("https://images.unsplash.com/photo-1566478989037-eec170784d47?w=400&q=80")
								.deliveryTime("10 MINS")
								.category("Grocery")
								.build(),

						// Sports
						Product.builder()
								.name("Cosco Cricket Tennis Ball")
								.weight("Pack of 1")
								.price(90.0)
								.originalPrice(120.0)
								.image("https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=400&q=80")
								.deliveryTime("15 MINS")
								.category("Sports")
								.build(),
						Product.builder()
								.name("Nivia Football Storm")
								.weight("Size 5")
								.price(449.0)
								.originalPrice(699.0)
								.image("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80")
								.deliveryTime("18 MINS")
								.category("Sports")
								.build(),

						// Books
						Product.builder()
								.name("Atomic Habits by James Clear")
								.weight("Paperback")
								.price(399.0)
								.originalPrice(799.0)
								.image("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80")
								.deliveryTime("15 MINS")
								.category("Books")
								.build(),
						Product.builder()
								.name("The Psychology of Money")
								.weight("Paperback")
								.price(299.0)
								.originalPrice(599.0)
								.image("https://images.unsplash.com/photo-1592492159418-09f31330c6cd?w=400&q=80")
								.deliveryTime("12 MINS")
								.category("Books")
								.build()
				);

				productRepository.saveAll(defaultProducts);
				System.out.println("EquiCart products successfully seeded into the database!");
			}
		};
	}
}
