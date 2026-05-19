import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip())

# 1. USER SERVICE
user_pkg = "user-service/src/main/java/com/example/userservice"
write_file("user-service/src/main/resources/application.properties", """
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/equicart?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=equicartSecretKeyThatMustBeAtLeast32BytesLongForHS256AlgorithmToWorkProperly
jwt.expirationMs=86400000
""")

write_file(f"{user_pkg}/entity/Role.java", """
package com.example.userservice.entity;
public enum Role { ROLE_USER, ROLE_ADMIN }
""")

write_file(f"{user_pkg}/entity/User.java", """
package com.example.userservice.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String username;
    private String password;
    private String email;
    @Enumerated(EnumType.STRING) private Role role;
}
""")

write_file(f"{user_pkg}/repository/UserRepository.java", """
package com.example.userservice.repository;
import com.example.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
""")

write_file(f"{user_pkg}/security/JwtUtils.java", """
package com.example.userservice.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .claim("role", userPrincipal.getAuthorities().iterator().next().getAuthority())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
               .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
""")

write_file(f"{user_pkg}/security/UserDetailsImpl.java", """
package com.example.userservice.security;
import com.example.userservice.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String username, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id; this.username = username; this.email = email; this.password = password; this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
        return new UserDetailsImpl(user.getId(), user.getUsername(), user.getEmail(), user.getPassword(), authorities);
    }
    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return username; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
""")

write_file(f"{user_pkg}/security/UserDetailsServiceImpl.java", """
package com.example.userservice.security;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        return UserDetailsImpl.build(user);
    }
}
""")

write_file(f"{user_pkg}/security/AuthTokenFilter.java", """
package com.example.userservice.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.err.println("Cannot set user authentication: " + e);
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
""")

write_file(f"{user_pkg}/security/WebSecurityConfig.java", """
package com.example.userservice.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
    @Autowired UserDetailsServiceImpl userDetailsService;
    
    @Bean public AuthTokenFilter authenticationJwtTokenFilter() { return new AuthTokenFilter(); }
    
    @Bean public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    
    @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .anyRequest().authenticated()
            );
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
""")

write_file(f"{user_pkg}/controller/AuthController.java", """
package com.example.userservice.controller;
import com.example.userservice.entity.Role;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthenticationManager authenticationManager;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.ROLE_USER);
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        return ResponseEntity.ok(Map.of("token", jwt));
    }
}
""")

# 2. PRODUCT SERVICE
prod_pkg = "product-service/src/main/java/com/example/productservice"
write_file("product-service/src/main/resources/application.properties", """
server.port=8082
spring.datasource.url=jdbc:mysql://localhost:3306/equicart?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
""")

write_file(f"{prod_pkg}/entity/Product.java", """
package com.example.productservice.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
}
""")

write_file(f"{prod_pkg}/repository/ProductRepository.java", """
package com.example.productservice.repository;
import com.example.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product, Long> {}
""")

write_file(f"{prod_pkg}/controller/ProductController.java", """
package com.example.productservice.controller;
import com.example.productservice.entity.Product;
import com.example.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired private ProductRepository repository;

    @GetMapping
    public List<Product> getAll() { return repository.findAll(); }

    @PostMapping
    public Product create(@RequestBody Product product) { return repository.save(product); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return repository.findById(id).map(p -> {
            p.setName(product.getName()); p.setDescription(product.getDescription());
            p.setPrice(product.getPrice()); p.setStock(product.getStock());
            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repository.deleteById(id); }
}
""")

# 3. ORDER SERVICE
order_pkg = "order-service/src/main/java/com/example/orderservice"
write_file("order-service/src/main/resources/application.properties", """
server.port=8083
spring.datasource.url=jdbc:mysql://localhost:3306/equicart?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
""")

write_file(f"{order_pkg}/entity/Order.java", """
package com.example.orderservice.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long userId;
    private Long productId;
    private Integer quantity;
    private Double totalPrice;
    private String status; // PENDING, COMPLETED, FAILED
    private LocalDateTime orderDate = LocalDateTime.now();
}
""")

write_file(f"{order_pkg}/repository/OrderRepository.java", """
package com.example.orderservice.repository;
import com.example.orderservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderRepository extends JpaRepository<Order, Long> {}
""")

write_file(f"{order_pkg}/controller/OrderController.java", """
package com.example.orderservice.controller;
import com.example.orderservice.entity.Order;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired private OrderRepository repository;

    @PostMapping
    public Order create(@RequestBody Order order) { 
        order.setStatus("PENDING");
        return repository.save(order); 
    }

    @GetMapping
    public List<Order> getAll() { return repository.findAll(); }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) { 
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Order not found")); 
    }
}
""")

# 4. PAYMENT SERVICE
pay_pkg = "payment-service/src/main/java/com/example/paymentservice"
write_file("payment-service/src/main/resources/application.properties", "server.port=8084")

write_file(f"{pay_pkg}/controller/PaymentController.java", """
package com.example.paymentservice.controller;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final String[] statuses = {"SUCCESS", "FAILED", "PENDING"};
    private final Random random = new Random();

    @PostMapping
    public Map<String, String> processPayment(@RequestBody Map<String, Object> paymentDetails) {
        String status = statuses[random.nextInt(statuses.length)];
        return Map.of("status", status, "transactionId", "TXN" + System.currentTimeMillis());
    }
}
""")

# 5. NOTIFICATION SERVICE
notif_pkg = "notification-service/src/main/java/com/example/notificationservice"
write_file("notification-service/src/main/resources/application.properties", "server.port=8085")

write_file(f"{notif_pkg}/controller/NotificationController.java", """
package com.example.notificationservice.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @PostMapping
    public String sendNotification(@RequestBody String message) {
        System.out.println("Sending notification: " + message);
        return "Notification sent successfully";
    }
}
""")

print("Scaffolding complete!")
