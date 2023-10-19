package com.website.personaltrainer.Controller;

import ch.qos.logback.core.util.Duration;
import com.website.personaltrainer.DTO.AuthCredentialsRequest;
import com.website.personaltrainer.Model.User;
import com.website.personaltrainer.Util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthCredentialsRequest req){
        try {
            // Authenticate the user's credentials
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            User user = (User) authenticate.getPrincipal();
            user.setPassword(null); // Remove the password from the user object

            Long userId = user.getId();

            // Generate a JWT token
            String token = jwtUtil.generateToken(user, userId);

            // Create a JWT cookie with a maximum age and return it in the response
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .path("/")
                    .maxAge(Duration.buildByDays(365).getMilliseconds())
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(token);
        } catch (BadCredentialsException ex) {
            // Return UNAUTHORIZED status if the credentials are invalid
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Endpoint to validate a JWT token
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@CookieValue(name = "jwt") String token,
                                           @AuthenticationPrincipal User user) {
        try {
            // Check if the token is valid and return the result
            Boolean isValidToken = jwtUtil.validateToken(token, user);
            return ResponseEntity.ok(isValidToken);
        } catch (ExpiredJwtException e) {
            // Handle an expired token
            return ResponseEntity.ok(false);
        }
    }

    // Endpoint for user logout
    @GetMapping("/logout")
    public ResponseEntity<?> logout () {
        // Expire the JWT cookie by setting a max age of 0
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("ok");
    }
}
