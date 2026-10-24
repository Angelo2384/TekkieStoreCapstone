/*
 * Customer.java
 * Customer Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Embedded;
import jakarta.persistence.PrePersist;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Entity
public class Customer {
    @Id
    private String customerId;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password cannot be blank")
    private String password;
    
    @Embedded
    @Valid
    private Name name;
    
    @NotBlank(message = "Mobile number cannot be blank")
    private String mobileNumber;
    
    @Embedded
    @Valid
    private Address address;

    private String role;

    // Account activity, set by the server only and shown to admins through AdminController
    @JsonIgnore
    @Column(updatable = false)
    private Instant createdAt;

    @JsonIgnore
    private Instant lastLoginAt;

    @JsonIgnore
    private Instant lastSeenAt;

    protected Customer(){}

    private Customer(Builder builder){
        this.customerId= builder.customerId;
        this.email= builder.email;
        this.password= builder.password;
        this.name= builder.name;
        this.mobileNumber= builder.mobileNumber;
        this.address= builder.address;
        this.role = builder.role;
        this.createdAt = builder.createdAt;
        this.lastLoginAt = builder.lastLoginAt;
        this.lastSeenAt = builder.lastSeenAt;
    }

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Name getName() {
        return name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public Address getAddress() {
        return address;
    }

    public String getRole() {
        return (role != null && !role.isBlank()) ? role : "CUSTOMER";
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", email='" + email + '\'' +
                ", name=" + name +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", address=" + address +
                ", role='" + getRole() + '\'' +
                '}';
    }

    public static class Builder{
       private String customerId;
       private String email;
       private String password;
       private Name name;
       private String mobileNumber;
       private Address address;
       private String role;
       private Instant createdAt;
       private Instant lastLoginAt;
       private Instant lastSeenAt;

       public Builder setCustomerId(String customerId) {
           this.customerId = customerId;
           return this;
       }

       public Builder setEmail(String email) {
           this.email = email;
           return this;
       }

       public Builder setPassword(String password) {
           this.password = password;
           return this;
       }

       public Builder setName(Name name) {
           this.name = name;
           return this;
       }

       public Builder setMobileNumber(String mobileNumber) {
           this.mobileNumber = mobileNumber;
           return this;
       }

       public Builder setAddress(Address address) {
           this.address = address;
           return this;
       }

       public Builder setRole(String role) {
           this.role = role;
           return this;
       }

       public Builder setCreatedAt(Instant createdAt) {
           this.createdAt = createdAt;
           return this;
       }

       public Builder setLastLoginAt(Instant lastLoginAt) {
           this.lastLoginAt = lastLoginAt;
           return this;
       }

       public Builder setLastSeenAt(Instant lastSeenAt) {
           this.lastSeenAt = lastSeenAt;
           return this;
       }

       public Builder copy(Customer customer){
           this.customerId= customer.customerId;
           this.email= customer.email;
           this.password= customer.password;
           this.name= customer.name;
           this.mobileNumber=customer.mobileNumber;
           this.address=customer.address;
           this.role=customer.role;
           this.createdAt=customer.createdAt;
           this.lastLoginAt=customer.lastLoginAt;
           this.lastSeenAt=customer.lastSeenAt;
           return this;
       }
       public Customer build(){return new Customer(this);}
   }
}
