package com.getski;

import com.getski.config.LectureStorageProperties;
import com.getski.config.ResortStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@EntityScan(basePackageClasses = {GetskiApplication.class, Jsr310JpaConverters.class})
@EnableConfigurationProperties({
        LectureStorageProperties.class, ResortStorageProperties.class
})
@SpringBootApplication
public class GetskiApplication extends SpringBootServletInitializer
 {
    @PostConstruct
    void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GetskiApplication.class, args);
    }

     @Override
     protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) { return builder.sources(GetskiApplication.class); }

}
