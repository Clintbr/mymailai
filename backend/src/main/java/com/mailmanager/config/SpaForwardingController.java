package com.mailmanager.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Forwards all non-API, non-static-asset requests to the React SPA entry
 * point (index.html), enabling React Router BrowserRouter to handle
 * client-side navigation even on hard refresh or direct URL access.
 *
 * Dispatch priority in Spring MVC:
 *   1. @RestController / @Controller with explicit paths (API endpoints)
 *   2. ResourceHttpRequestHandler (files in classpath:/static/)
 *   3. This catch-all controller (everything else -> index.html)
 */
@Controller
public class SpaForwardingController {

    /**
     * Single-segment SPA routes, e.g. /settings, /inbox
     * The regex [^.] excludes paths with a dot (file extensions) so that
     * missing static assets return 404 instead of serving index.html.
     */
    @RequestMapping(value = "/{path:[^.]*}")
    public String forwardSingleSegment() {
        return "forward:/index.html";
    }

    /**
     * Multi-segment SPA routes, e.g. /mail/abc123
     */
    @RequestMapping(value = "/{path:[^.]*}/**")
    public String forwardMultiSegment(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/") || uri.startsWith("/v3/")
                || uri.startsWith("/swagger-ui") || uri.startsWith("/actuator")) {
            return null;
        }
        return "forward:/index.html";
    }
}