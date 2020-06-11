package com.getski.controller;

import com.getski.model.Resort;
import com.getski.model.ResortImage;
import com.getski.repository.ResortImageRepository;
import com.getski.repository.ResortRepository;
import com.getski.service.ResortImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ski")
public class ResortController {
    private ResortRepository resortRepository;
    private ResortImageRepository resortImageRepository;
    private ResortImageService resortImageService;

    // hasRole 안에 prefix "ROLE_"가 자동으로 붙음
    //    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/newResort", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Resort newResort(@RequestParam("resortName") String resortName,
                            @RequestParam("location") String location,
                            @RequestParam("region") String region,
                            @RequestParam("intro") String intro,
                            @RequestParam("pageLink") String pageLink,
                            @RequestParam(value = "resortImages", required = false)
                                    MultipartFile[] resortImages,
                            @RequestParam(value = "liftImages", required = false)
                                    MultipartFile[] liftImages,
                            @RequestParam(value = "rentalImages", required = false)
                                    MultipartFile[] rentalImages,
                            @RequestParam(value = "slopeImages", required = false)
                                    MultipartFile[] slopeImages) {
        int Region = 0;
        if (region.equals("강원")) Region = 20;
        else if (region.equals("서울")) Region = 10;
        else if (region.equals("경기")) Region = 41;
        else if (region.equals("전북")) Region = 56;
        else if (region.equals("전남")) Region = 51;
        else if (region.equals("충북")) Region = 36;
        else if (region.equals("충남")) Region = 31;
        else if (region.equals("경북")) Region = 71;
        else if (region.equals("경남")) Region = 62;

        location = location.substring(2);

        Resort resort = new Resort(resortName, location, Region, intro, pageLink);
        Resort result = resortRepository.save(resort);

        if (resortImages.length > 0) {
            for (MultipartFile file : resortImages) {
                ResortImage image = resortImageService.saveResortImage(file, "스키장");
                image.setResort(result);
                resortImageRepository.save(image);
            }
        }

        if (liftImages.length > 0) {
            for (MultipartFile file : liftImages) {
                ResortImage image = resortImageService.saveResortImage(file, "리프트");
                image.setResort(result);
                resortImageRepository.save(image);
            }
        }

        if (rentalImages.length > 0) {
            for (MultipartFile file : rentalImages) {
                ResortImage image = resortImageService.saveResortImage(file, "렌탈");
                image.setResort(result);
                resortImageRepository.save(image);
            }
        }

        if (slopeImages.length > 0) {
            for (MultipartFile file : slopeImages) {
                ResortImage image = resortImageService.saveResortImage(file, "슬로프");
                image.setResort(result);
                resortImageRepository.save(image);
            }
        }

        return resortRepository.save(result);
    }

    @GetMapping("/getResort")
    public Collection<Resort> getResort() {
        return resortRepository.findAll();
    }

    @GetMapping("/getResortById/{resortId}")
    public Resort getResortById(@PathVariable Long resortId) {
        return resortRepository.findByResortId(resortId);
    }

    @GetMapping("/getResortByName/{resortName}")
    public Resort getResortByName(@PathVariable String resortName) {
        return resortRepository.findByResortName(resortName);
    }

    @GetMapping("/getResortByRegion/{region}")
    public Collection<Resort> getResortByRegion(@PathVariable int region) {
        return resortRepository.findByResortRegion(region);
    }

    @PutMapping(value = "/updateResort/{resortId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Resort updateResort(@RequestBody Resort updateResort,
                               @RequestParam(value = "resortImages", required = false)
                                       MultipartFile[] resortImages,
                               @RequestParam(value = "liftImages", required = false)
                                       MultipartFile[] liftImages,
                               @RequestParam(value = "rentalImages", required = false)
                                       MultipartFile[] rentalImages,
                               @RequestParam(value = "slopeImages", required = false)
                                       MultipartFile[] slopeImages,
                               @PathVariable(value = "resortId") Long resortId) {
        Resort resort = resortRepository.findByResortId(resortId);

        resort.setResortName(updateResort.getResortName());
        resort.setIntro(updateResort.getIntro());
        resort.setLocation(updateResort.getLocation());
        resort.setRegion(updateResort.getRegion());
        resort.setPageLink(updateResort.getPageLink());

        if (resortImages.length > 0) {
            for (MultipartFile file : resortImages) {
                ResortImage image = resortImageService.saveResortImage(file, "스키장");
                image.setResort(resort);
                resortImageRepository.save(image);
            }
        }

        if (liftImages.length > 0) {
            for (MultipartFile file : liftImages) {
                ResortImage image = resortImageService.saveResortImage(file, "리프트");
                image.setResort(resort);
                resortImageRepository.save(image);
            }
        }

        if (rentalImages.length > 0) {
            for (MultipartFile file : rentalImages) {
                ResortImage image = resortImageService.saveResortImage(file, "렌탈");
                image.setResort(resort);
                resortImageRepository.save(image);
            }
        }

        if (slopeImages.length > 0) {
            for (MultipartFile file : slopeImages) {
                ResortImage image = resortImageService.saveResortImage(file, "슬로프");
                image.setResort(resort);
                resortImageRepository.save(image);
            }
        }
        return resortRepository.save(resort);
    }

    @GetMapping("/getResortImageByType/{resortId}/{imageType}")
    public List<ResortImage> getResortImageByType(@PathVariable Long resortId, @PathVariable String imageType) {
        return resortImageRepository.getResortImageByType(resortId, imageType);
    }

    @DeleteMapping("/deleteResort/{resortId}")
    public void deleteResort(@PathVariable(value = "resortId") Long resortId) {
        resortRepository.deleteById(resortId);
    }

    @DeleteMapping("/deleteResortImageById/{imageId}")
    public void deleteResortImageById(@PathVariable String imageId) {
        Optional<ResortImage> image = resortImageRepository.findById(imageId);
        resortImageService.deleteResortImage(image.get());
        resortImageRepository.deleteImageById(imageId);
    }
}
