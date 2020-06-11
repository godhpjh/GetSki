package com.getski.controller;

import com.getski.exception.ResourceNotFoundException;
import com.getski.model.User;
import com.getski.payload.UserIdentityAvailability;
import com.getski.payload.UserProfile;
import com.getski.repository.UserRepository;
import com.getski.security.CurrentUser;
import com.getski.security.UserPrincipal;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
class UserController {
    private UserRepository userRepository;
    
    @GetMapping("/user/me")
    public UserPrincipal getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserPrincipal userPrincipal = new UserPrincipal(currentUser.getId(), currentUser.getName(),
                currentUser.getUsername(), currentUser.getAuthorities());
        return userPrincipal;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(),user.getEmail(), user.getPhonenumber(),user.isChecked(),user.getBirthdate());

        return userProfile;
    }
}