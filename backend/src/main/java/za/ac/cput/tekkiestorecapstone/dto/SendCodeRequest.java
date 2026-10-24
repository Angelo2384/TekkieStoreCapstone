/*
 * SendCodeRequest.java
 * Request to email a signup verification code
 */
package za.ac.cput.tekkiestorecapstone.dto;

public class SendCodeRequest {
    private String email;

    public SendCodeRequest() {}

    public SendCodeRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
