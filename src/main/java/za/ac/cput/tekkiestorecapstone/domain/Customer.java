package za.ac.cput.tekkiestorecapstone.domain;

public class Customer {
    private String customerId;
    private String email;
    private Name name;
    private String mobileNumber;
    private Address address;

    protected Customer(){}

    private Customer(Builder builder){
        this.customerId= builder.customerId;
        this.email= builder.email;
        this.name= builder.name;
        this.mobileNumber= builder.mobileNumber;
        this.address= builder.address;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", email='" + email + '\'' +
                ", name=" + name +
                ", mobileNumber='" + mobileNumber + '\'' +
                ", address=" + address +
                '}';
    }

    public static class Builder{
       private String customerId;
       private String email;
       private Name name;
       private String mobileNumber;
       private Address address;

       public Builder setCustomerId(String customerId) {
           this.customerId = customerId;
           return this;
       }

       public Builder setEmail(String email) {
           this.email = email;
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

       public Builder copy(Customer customer){
           this.customerId= customer.customerId;
           this.email= customer.email;
           this.name= customer.name;
           this.mobileNumber=customer.mobileNumber;
           this.address=customer.address;
           return this;
       }
       public Customer build(){return new Customer(this);}
   }
}
