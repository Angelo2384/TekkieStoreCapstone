package za.ac.cput.tekkiestorecapstone.dto;

public class CreateAdminRequest {
    private String email;
    private String password;
    private String fullName;
    private String firstName;
    private String lastName;
    private String mobileNumber;

    public CreateAdminRequest() {}

    public CreateAdminRequest(String email, String password, String fullName, String firstName, String lastName, String mobileNumber) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
}

