package com.mailmanager.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all non-API, non-static routes to index.html so that the
 * React SPA router (BrowserRouter) can handle client-side navigation.
 *
 * Without this, refreshing the page on /settings or /mail/:id would
 * return a 404 from Spring Boot instead of serving the SPA.
 */
@Controller
public class SpaForwardingController {

    /**
     * Match every path that is NOT:
     *   - /api/**        ? REST endpoints
     *   - /v3/api-docs   ? OpenAPI spec
     *   - /swagger-ui/** ? Swagger UI
     *   - /actuator/**   ? Actuator (if ever added)
     *   - Paths with a file extension (static assets: .js, .css, .png, etc.)
     *
     * All matched paths are forwarded to /index.html served from
     * src/main/resources/static/ (embedded in the JAR at build time).
     */
    @RequestMapping(value = {
            "/",
            "/settings",
            "/mail/{id:[^.]+}",
            "/{path:^(?!api|v3|swagger-ui|actuator).*}",
            "/{path:^(?!api|v3|swagger-ui|actuator).*}/**"
    })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}
