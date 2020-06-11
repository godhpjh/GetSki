package com.getski.controller;


import com.getski.model.Comment;
import com.getski.model.Lecture;
import com.getski.model.User;
import com.getski.payload.CommentRequest;
import com.getski.repository.CommentRepository;
import com.getski.repository.LectureRepository;
import com.getski.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private LectureRepository lectureRepository;
    private UserRepository userRepository;
    private CommentRepository commentRepository;

    @PostMapping("/addComment/{lectureId}/{userId}")
    public Comment addComment(@RequestBody CommentRequest commentRequest, @PathVariable Long lectureId, @PathVariable Long userId) {
        User user = userRepository.findById(userId).get();
        Lecture lecture = lectureRepository.findByLectureId(lectureId);
        Comment comment = new Comment(commentRequest.getCommentDescription(), commentRequest.getRate(), user, lecture);
        return commentRepository.save(comment);
    }

    @GetMapping("/getCommentByLecId/{lectureId}")
    public Collection<Comment> lectureCommentList(@PathVariable Long lectureId) {
        return commentRepository.findAllByLectureId(lectureId);
    }

    @GetMapping("/getAllComment")
    public Collection<Comment> findAllComment() {
        List<Comment> list = commentRepository.findAll();
        for (Comment c : list) {
            System.out.println("#########" + c.getUser() + ", " + c.getLecture());
        }
        return commentRepository.findAll();
    }

    @PutMapping("/updateComment/{commentId}")
    public Comment updateComment(@RequestBody CommentRequest commentRequest, @PathVariable Long commentId) {
        Comment comment = commentRepository.findById(commentId).get();
        comment.setCommentDescription(commentRequest.getCommentDescription());
        comment.setRate(commentRequest.getRate());
        return commentRepository.save(comment);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentRepository.deleteById(commentId);
    }

    @GetMapping("/getAvgRate/{lectureId}")
    public Double getAgeRate(@PathVariable Long lectureId) {
        Double avg = commentRepository.getAvgByLectureId(lectureId);
        return Math.round(avg * 10) / 10.0;
    }
}
