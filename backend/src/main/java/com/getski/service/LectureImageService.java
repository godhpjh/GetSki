package com.getski.service;

import com.getski.config.LectureStorageProperties;
import com.getski.exception.FileStorageException;
import com.getski.model.LectureImage;
import com.getski.model.ResortImage;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@AllArgsConstructor
@Service
public class LectureImageService {
    private final Path fileStorageLocation;

    @Autowired
    public LectureImageService(LectureStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("파일을 업로드할 디렉토리를 생성하지 못했습니다.", ex);
        }
    }

    //강좌 이미지 파일 저장
    public LectureImage saveLectureImage(MultipartFile eFile) {
        //파일 이름
        String fileName = StringUtils.cleanPath(eFile.getOriginalFilename());
        String fileUri = "/images/lecture/" + fileName;

        try {
            // 파일명에 부적합 문자가 있는지 확인한다.
            if (fileName.contains("..")) {
                throw new FileStorageException("파일명에 부적합 문자가 포함되어 있습니다. " + fileName);
            }
            //동일한 파일 이름이 존재한다면 copy 대체
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(eFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return new LectureImage(fileName, eFile.getContentType(), fileUri, eFile.getSize());
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void deleteLectureImage(LectureImage image) {
        try {
            Path targetLocation = this.fileStorageLocation.resolve(image.getFileName());
            Files.delete(targetLocation);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file " + image.getFileName() + ". Please try again!", ex);
        }
    }
}
