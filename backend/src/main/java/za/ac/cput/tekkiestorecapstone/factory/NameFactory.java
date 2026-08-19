/*
 * NameFactory.java
 * Factory for Name Value Object
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class NameFactory {

    public static Name createName(
            String firstName,
            String middleName,
            String lastName) {

        if (Helper.isNullOrEmpty(firstName)
                || Helper.isNullOrEmpty(lastName)) {
            return null;
        }

        return new Name.Builder()
                .setFirstName(firstName)
                .setMiddleName(middleName)
                .setLastName(lastName)
                .build();
    }
}