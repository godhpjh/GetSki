package com.getski.controller;


import com.getski.model.Lecture;
import com.getski.model.LectureInfo;
import com.getski.model.Register;
import com.getski.model.User;
import com.getski.payload.RegisterRequest;
import com.getski.repository.LectureInfoRepository;
import com.getski.repository.LectureRepository;
import com.getski.repository.RegisterRepository;
import com.getski.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/register")
public class RegisterController {
    private RegisterRepository registerRepository;
    private UserRepository userRepository;
    private LectureRepository lectureRepository;
    private LectureInfoRepository lectureInfoRepository;

    @PostMapping("/buyLecture")
    public Collection<Register> buyLecture(@RequestBody RegisterRequest registerRequest) {
        Long userId = registerRequest.getUserId();
        Long lectureId = registerRequest.getLectureId();
        Long lectureInfoId = registerRequest.getLectureInfoId();
        int headCount = registerRequest.getHeadCount();
        User user = userRepository.findById(userId).get();
        Lecture lecture = lectureRepository.findByLectureId(lectureId);
        LectureInfo lectureInfo = lectureInfoRepository.findByLectureInfoId(lectureInfoId);

        Collection<Register> list = new ArrayList<>();
        for(int k=0;k<headCount;k++){
            Register reg = new Register(user, lecture, lectureInfo);
            list.add(reg);
            registerRepository.save(reg);
        }
        return list;
    }

    @GetMapping("/myLectureList/{userId}")
    public Collection<Lecture> myLectureList(@PathVariable Long userId) {
        List<Lecture> result = new ArrayList<>();
        Collection<Long> lectureIds = registerRepository.findLectureIdsByUserId(userId);
        for (Long id : lectureIds)
            result.add(lectureRepository.findByLectureId(id));
        return result;
    }

    @GetMapping("/myLectureInfoList/{userId}")
    public Collection<LectureInfo> myLectureInfoList(@PathVariable Long userId) {
        Collection<LectureInfo> result = new ArrayList<>();
        Collection<Long> lectureInfoIds = registerRepository.findLectureInfoIdByUserId(userId);
        for (Long id : lectureInfoIds) {
            LectureInfo lectureInfo = lectureInfoRepository.findByLectureInfoId(id);
            result.add(lectureInfo);
        }
        return result;
    }

    @GetMapping("/getMyLecture/{lectureInfoId}")
    public Optional<Lecture> getMyLecture(@PathVariable Long lectureInfoId) {
        Long lectureId = lectureInfoRepository.findLectureIdByLectureInfoId(lectureInfoId);
        return lectureRepository.findById(lectureId);
    }

    @GetMapping("/checkLectureCurrentAmount/{lectureInfoId}")
    public int checkLectureCurrentAmount(@PathVariable Long lectureInfoId) {
        return registerRepository.getCurrentAmountPeople(lectureInfoId);
    }
}
