package com.mailmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Configures Spring MVC to serve the embedded React SPA correctly.
 *
 * Strategy:
 *   1. All requests are handled by the static resource handler mapped to "/**".
 *   2. The PathResourceResolver first tries to find the requested file in
 *      classpath:/static/ (e.g. /assets/index-abc.js -> real file -> served).
 *   3. If NO matching static file exists, it falls back to /index.html, letting
 *      React Router handle the route on the client side.
 *
 * This replaces the old SpaForwardingController approach which incorrectly
 * intercepted static asset paths before they could be served as files.
 *
 * API routes (/api/**, /v3/api-docs/**, /swagger-ui/**) are matched first by
 * @RestController mappings and never reach this resource handler.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private static final String INDEX_HTML = "/index.html";
    private static final String STATIC_LOCATION = "classpath:/static/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
            .addResourceHandler("/**")
            .addResourceLocations(STATIC_LOCATION)
            .resourceChain(true)
            .addResolver(new PathResourceResolver() {
                @Override
                protected Resource getResource(String resourcePath, Resource location)
                        throws IOException {
                    Resource requested = location.createRelative(resourcePath);
                    // If the file physically exists in /static/, serve it directly.
                    if (requested.exists() && requested.isReadable()) {
                        return requested;
                    }
                    // Otherwise fall back to index.html for SPA client-side routing.
                    Resource indexHtml = new ClassPathResource("static" + INDEX_HTML);
                    return indexHtml.exists() ? indexHtml : null;
                }
            });
    }
}