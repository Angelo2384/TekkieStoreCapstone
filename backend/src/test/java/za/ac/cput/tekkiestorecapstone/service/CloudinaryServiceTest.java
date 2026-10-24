/* CloudinaryServiceTest.java
Unit test for Cloudinary 3rd-party media service
Author: Lyle Solomons (230123872)
*/

package za.ac.cput.tekkiestorecapstone.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.File;
import java.net.URL;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.MethodName.class)
public class CloudinaryServiceTest {

    private CloudinaryService cloudinaryService;
    private static String uploadedPublicId;

    @BeforeEach
    void setUp() {
        Cloudinary cloudinary = new Cloudinary(CloudinaryTestConfig.loadCloudinaryConfig());
        this.cloudinaryService = new CloudinaryService(cloudinary);
    }

    @Test
    void a_uploadFile() throws Exception {
        // Small sample shoe image kept with the tests (src/test/resources)
        URL sample = getClass().getResource("/sample-shoe.jpg");
        assertNotNull(sample, "sample-shoe.jpg should be in backend/src/test/resources");
        File testFile = new File(sample.toURI());

        // Separate "test" folder so the upload and clean-up can never touch real product images
        Map<?, ?> result = cloudinaryService.uploadFile(testFile, "test");

        assertNotNull(result, "Upload result should not be null");
        assertNotNull(result.get("secure_url"), "Upload result must contain a secure_url");

        String secureUrl = (String) result.get("secure_url");
        uploadedPublicId = (String) result.get("public_id");

        assertTrue(secureUrl.startsWith("https://res.cloudinary.com/"), "URL must be a valid Cloudinary HTTPS URL");

        System.out.println("=================================================");
        System.out.println("CLOUDINARY UPLOAD SUCCESSFUL!");
        System.out.println("Public ID:  " + uploadedPublicId);
        System.out.println("Secure URL: " + secureUrl);
        System.out.println("=================================================");

        // Delete the test upload so each test run doesn't leave a copy in Cloudinary
        Map<?, ?> deleted = cloudinaryService.deleteImage(uploadedPublicId);
        assertEquals("ok", deleted.get("result"), "Test upload should be deleted from Cloudinary");
    }

    @Test
    void b_verifyCredentials() {
        assertNotNull(cloudinaryService);
        System.out.println("CloudinaryService successfully instantiated and configured.");
    }
}
