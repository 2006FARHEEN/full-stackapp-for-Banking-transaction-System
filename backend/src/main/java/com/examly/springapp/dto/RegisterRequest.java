// package com.examly.springapp.dto;

// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

// public class RegisterRequest {

//     @NotBlank(message = "Username is required")
//     private String username;

//     @Email(message = "Invalid email")
//     @NotBlank(message = "Email is required")
//     private String email;

//     @Size(min = 6, message = "Password must be at least 6 characters")
//     private String password;

//     public RegisterRequest() {
//     }

//     public RegisterRequest(String username, String email, String password) {
//         this.username = username;
//         this.email = email;
//         this.password = password;
//     }

//     public String getUsername() {
//         return username;
//     }

//     public void setUsername(String username) {
//         this.username = username;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getPassword() {
//         return password;
//     }

//     public void setPassword(String password) {
//         this.password = password;
//     }
// }
package com.examly.springapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    // Optional - required only for ADMIN
    private String adminKey;

    public RegisterRequest() {
    }

    public RegisterRequest(String username,
                           String email,
                           String password,
                           String role,
                           String adminKey) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.adminKey = adminKey;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAdminKey() {
        return adminKey;
    }

    public void setAdminKey(String adminKey) {
        this.adminKey = adminKey;
    }
}