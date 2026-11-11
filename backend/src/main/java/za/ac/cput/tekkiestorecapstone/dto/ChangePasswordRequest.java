/*
 * ChangePasswordRequest.java
 * The new password a logged-in user chooses to replace a temporary one
 */
package za.ac.cput.tekkiestorecapstone.dto;

public class ChangePasswordRequest {
    private String password;

    public ChangePasswordRequest() {}

    public ChangePasswordRequest(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
