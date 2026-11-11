/*
 * ActivityLogController.java
 * The owner's Activity page: who changed what in the admin portal (owner only, see SecurityConfig)
 */
package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.tekkiestorecapstone.domain.ActivityLog;
import za.ac.cput.tekkiestorecapstone.service.ActivityLogService;

import java.util.List;

@RestController
@RequestMapping("/admin/activity")
public class ActivityLogController {

    private final ActivityLogService service;

    public ActivityLogController(ActivityLogService service) {
        this.service = service;
    }

    @GetMapping
    public List<ActivityLog> getRecent() {
        return service.getRecent();
    }
}
