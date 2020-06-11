package com.getski.controller;

import com.getski.exception.AppException;
import com.getski.model.Role;
import com.getski.model.RoleName;
import com.getski.model.User;
import com.getski.payload.ApiResponse;
import com.getski.payload.JwtAuthenticationResponse;
import com.getski.payload.LoginRequest;
import com.getski.payload.SignUpRequest;
import com.getski.repository.RoleRepository;
import com.getski.repository.UserRepository;
import com.getski.security.jwt.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), signUpRequest.getPassword(), signUpRequest.getPhonenumber(), signUpRequest.isChecked(), signUpRequest.getBirthdate());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = null;
        if (signUpRequest.getUsername().equals("admin")) {
            userRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new AppException("User Role not set."));
        } else if (signUpRequest.isChecked()) {
            userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new AppException("User Role not set."));
        } else {
            userRole = roleRepository.findByName(RoleName.ROLE_INSTRUCTOR)
                    .orElseThrow(() -> new AppException("User Role not set."));
        }
        user.setRoles(Collections.singleton(userRole));
        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/user/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }

    @PutMapping("/updateuserinfo/{id}")
    public ResponseEntity<?> updateUser(@RequestBody SignUpRequest signUpRequest, @PathVariable(value = "id") Long id) {
        Optional<User> user = userRepository.findById(id);

        user.get().setBirthdate(signUpRequest.getBirthdate());
        user.get().setPhonenumber(signUpRequest.getPhonenumber());
        user.get().setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        User result = userRepository.save(user.get());

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/user/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User Infomation Update successfully"));
    }

    @DeleteMapping("/deleteuserinfo/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable(value = "id") Long id) {
        User user = userRepository.findById(id).get();
        userRepository.deleteById(id);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/user/{username}")
                .buildAndExpand(user.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User Infomation delete successfully"));
    }
}