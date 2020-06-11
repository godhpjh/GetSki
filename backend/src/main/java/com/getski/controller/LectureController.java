package com.getski.controller;

import com.getski.model.Lecture;
import com.getski.model.LectureImage;
import com.getski.model.LectureInfo;
import com.getski.model.Resort;
import com.getski.repository.LectureImageRepository;
import com.getski.repository.LectureInfoRepository;
import com.getski.repository.LectureRepository;
import com.getski.repository.ResortRepository;
import com.getski.service.LectureImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ski")
public class LectureController {
    private ResortRepository resortRepository;
    private LectureRepository lectureRepository;
    private LectureImageRepository lectureImageRepository;
    private LectureInfoRepository lectureInfoRepository;
    private LectureImageService lectureImageService;

    //    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping(value = "/newLecture/{resortId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Collection<LectureInfo> newLecture(@RequestParam("lectureName") String lectureName,
                                              @RequestParam("instructorId") Long instructorId,
                                              @RequestParam("lecturePrice") String lecturePrice,
                                              @RequestParam(value = "lectureDate", required = true) String[] lectureDate,
                                              @RequestParam(value = "lectureTime", required = true) String[] lectureTime,
                                              @RequestParam("lectureCapacity") int lectureCapacity,
                                              @RequestParam("lectureDescription") String lectureDescription,
                                              @RequestParam(value = "lectureImages", required = false) MultipartFile[] lectureImages,
                                              @PathVariable Long resortId) {

        Lecture lecture = new Lecture(lectureName, instructorId, lecturePrice, lectureDescription, lectureCapacity);
        Resort resort = resortRepository.findByResortId(resortId);
        lecture.setResort(resort);
        Lecture result = lectureRepository.save(lecture);

        Collection<LectureInfo> list = new ArrayList<>();
        for (String date : lectureDate) {
            for (String time : lectureTime) {
                LectureInfo lectureInfo = new LectureInfo(date, time);
                lectureInfo.setLecture(result);
                lectureInfo.setLid(result.getLectureId());
                list.add(lectureInfo);
                lectureInfoRepository.save(lectureInfo);
            }
        }

        for (MultipartFile file : lectureImages) {
            LectureImage image = lectureImageService.saveLectureImage(file);
            image.setLecture(result);
            lectureImageRepository.save(image);
        }

        return list;
    }

    @GetMapping("/getLecture")
    public Collection<Lecture> getLecture() {
        return lectureRepository.findAll();
    }

    @GetMapping("/getLectureById/{lectureId}")
    public Lecture getLectureById(@PathVariable Long lectureId) {
        return lectureRepository.findById(lectureId).get();
    }

    @GetMapping("/getLectureByResortId/{resortId}")
    public Collection<Lecture> getLectureByResortId(@PathVariable Long resortId) {
        return lectureRepository.getLectureByResortId(resortId);
    }

    @GetMapping("/getResortByLectureId/{lectureId}")
    public Resort getResortByLectureid(@PathVariable Long lectureId){
        Long curId = lectureRepository.getResortIdByLectureId(lectureId);
        Resort res = resortRepository.findByResortId(curId);
        return res;
    }

    @GetMapping("/getLectureByInstructorId/{instructorId}")
    public Collection<Lecture> getLectureByInstructorId(@PathVariable Long instructorId) {
        return lectureRepository.getLectureByInstructorId(instructorId);
    }

    @GetMapping("/getLectureByRegion/{regionId}")
    public Collection<Lecture> getLectureByRegion(@PathVariable int regionId) {
        Collection<Lecture> result = new ArrayList<>();
        Collection<Resort> resorts = resortRepository.findByResortRegion(regionId);
        for (Resort r : resorts) {
            ArrayList<Lecture> list = lectureRepository.getLectureByResortId(r.getResortId());
            result.addAll(list);
        }
        return result;
    }

    @GetMapping("/getLectureByAllRegion")
    public HashMap<String, ArrayList<Lecture>> getLectureByAllRegion() {
        Collection<Integer> regions = resortRepository.getAllRegion();
        HashMap<String, ArrayList<Lecture>> resultMap = new HashMap<>();
        String[] regionInitial = {"KK", "KW", "JB", "KN"};

        String regionName = "";
        for (Integer i : regions) {
            Collection<Resort> resortList = resortRepository.findByResortRegion(i);
            if (i == 20)
                regionName = regionInitial[1];
            else if (i == 41)
                regionName = regionInitial[0];
            else if (i == 62)
                regionName = regionInitial[3];
            else if (i == 56)
                regionName = regionInitial[2];

            for (Resort resort : resortList) {
                ArrayList<Lecture> lectureList = lectureRepository.getLectureByResortId(resort.getResortId());
                ArrayList<Lecture> curList = resultMap.get(regionName);
                if (curList == null) {
                    resultMap.put(regionName, lectureList);
                } else {
                    curList.addAll(lectureList);
                    resultMap.put(regionName, curList);
                }
            }
        }
        return resultMap;
    }

    @GetMapping("/getLectureInfoByLectureId/{lectureId}")
    public Collection<LectureInfo> getLectureInfoByLectureId(@PathVariable Long lectureId) {
        return lectureInfoRepository.findLectureInfoByLectureId(lectureId);
    }

    //    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping(value = "/updateLecture/{lectureId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Collection<LectureInfo> updateLecture(@RequestParam("lectureName") String lectureName,
                                                 @RequestParam("instructorId") Long instructorId,
                                                 @RequestParam("lecturePrice") String lecturePrice,
                                                 @RequestParam(value = "lectureDate", required = true) String[] lectureDate,
                                                 @RequestParam(value = "lectureTime", required = true) String[] lectureTime,
                                                 @RequestParam("lectureCapacity") int lectureCapacity,
                                                 @RequestParam("lectureDescription") String lectureDescription,
                                                 @RequestParam("resortId") Long resortId,
                                                 @RequestParam(value = "lectureImages", required = false) MultipartFile[] lectureImages,
                                                 @PathVariable(value = "lectureId") Long lectureId) {

        deleteLectureInfoByLectureId(lectureId);

        Lecture lecture = lectureRepository.getOne(lectureId);
        Resort resort = resortRepository.findByResortId(resortId);
        lecture.setResort(resort);
        lecture.setLectureName(lectureName);
        lecture.setInstructorId(instructorId);
        lecture.setLecturePrice(lecturePrice);
        lecture.setLectureDescription(lectureDescription);
        lecture.setCapacity(lectureCapacity);
        Lecture result = lectureRepository.save(lecture);

        Collection<LectureInfo> list = new ArrayList<>();
        for (String date : lectureDate) {
            for (String time : lectureTime) {
                LectureInfo lectureInfo = new LectureInfo(date, time);
                lectureInfo.setLecture(result);
                lectureInfo.setLid(result.getLectureId());
                list.add(lectureInfo);
                lectureInfoRepository.save(lectureInfo);
            }
        }

        for (MultipartFile file : lectureImages) {
            LectureImage image = lectureImageService.saveLectureImage(file);
            image.setLecture(result);
            lectureImageRepository.save(image);
        }
        return list;
    }

    @DeleteMapping("/deleteLecture/{lectureId}")
    public void deleteLecture(@PathVariable(value = "lectureId") Long lectureId) {
        lectureRepository.deleteById(lectureId);
    }

    @GetMapping("/getLectureImageByLectureId/{lectureId}")
    public List<LectureImage> getLectureImageByLectureId(@PathVariable Long lectureId) {
        return lectureImageRepository.getLectureImageByLectureId(lectureId);
    }

    @DeleteMapping("/deleteLectureImageByLectureId/{lectureId}")
    public void deleteLectureImageByLectureId(@PathVariable Long lectureId) {
        Collection<LectureImage> lecimg = lectureImageRepository.getLectureImageByLectureId(lectureId);
        for(LectureImage curimg : lecimg) lectureImageService.deleteLectureImage(curimg);
        lectureImageRepository.deleteImageByLectureId(lectureId);
    }

    @DeleteMapping("/deleteLectureinfoByLectureId/{lectureId}")
    public void deleteLectureInfoByLectureId(@PathVariable Long lectureId){
        Collection<LectureInfo> lecinfos = lectureInfoRepository.findLectureInfoByLectureId(lectureId);
        for(LectureInfo curinfo : lecinfos) lectureInfoRepository.deleteById(curinfo.getLectureInfoId());
    }
}
