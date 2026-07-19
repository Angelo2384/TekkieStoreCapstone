/*
DeliveryDetails.java
Author: Rameez Karriem
Student Number: 222357320
Date: 18 July 2026
 */

package za.ac.cput.tekkiestorecapstone.domain;

import java.util.Date;

public class DeliveryDetails {
    private String deliveryId;
    private Address address;
    private String courier;
    private String trackingNumber;
    private Date estimatedDeliveryDate;

    protected DeliveryDetails(){}

    private DeliveryDetails(Builder build){
        this.deliveryId= build.deliveryId;
        this.address= build.address;
        this.courier= build.courier;
        this.trackingNumber= build.trackingNumber;
        this.estimatedDeliveryDate= build.estimatedDeliveryDate;
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public Address getAddress() {
        return address;
    }

    public String getCourier() {
        return courier;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public Date getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }

    @Override
    public String toString() {
        return "DeliveryDetails{" +
                "deliveryId='" + deliveryId + '\'' +
                ", address=" + address +
                ", courier='" + courier + '\'' +
                ", trackingNumber='" + trackingNumber + '\'' +
                ", estimatedDeliveryDate=" + estimatedDeliveryDate +
                '}';
    }

    public static class Builder{
        private String deliveryId;
        private Address address;
        private String courier;
        private String trackingNumber;
        private Date estimatedDeliveryDate;

        public Builder setDeliveryId(String deliveryId) {
            this.deliveryId = deliveryId;
            return this;
        }

        public Builder setAddress(Address address) {
            this.address = address;
            return this;
        }

        public Builder setCourier(String courier) {
            this.courier = courier;
            return this;
        }

        public Builder setTrackingNumber(String trackingNumber) {
            this.trackingNumber = trackingNumber;
            return this;
        }

        public Builder setEstimatedDeliveryDate(Date estimatedDeliveryDate) {
            this.estimatedDeliveryDate = estimatedDeliveryDate;
            return this;
        }

        public Builder copy(DeliveryDetails deliveryDetails){
            this.deliveryId= deliveryDetails.deliveryId;
            this.address= deliveryDetails.address;
            this.courier= deliveryDetails.courier;
            this.trackingNumber= deliveryDetails.trackingNumber;
            this.estimatedDeliveryDate= deliveryDetails.estimatedDeliveryDate;
            return this;
        }
        public DeliveryDetails build(){return new DeliveryDetails(this);}
    }
}
