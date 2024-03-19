package com.project.FrontToAI;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class FrontToAIController {

    private final FrontToAIService FrontToAI_service;

    @CrossOrigin(origins = "http://ec2-13-124-121-82.ap-northeast-2.compute.amazonaws.com:8080")
    @PostMapping("diagnosis")
    public Map<String,Object> handleInput(@RequestPart("imageFile") MultipartFile file, @RequestParam("agricultureType") Integer agri_id, @RequestParam("lat") Double lat, @RequestParam("lng") Double lng) throws IOException
    // lat : 위도, lng : 경도
    {
        String fileName = file.getOriginalFilename();

        File saveFile = new File("/home/ubuntu/iphoto/" + fileName);

        file.transferTo(saveFile);

        String savedImagePath = saveFile.getAbsolutePath();
        //System.out.println("File saved at: " + savedImagePath);

        Map<String, Object> response = FrontToAI_service.GetInfoFromAI(agri_id, savedImagePath);

        //System.out.println("2 : " + response);

        if (lat != 0 && lng != 0) // 50퍼보다 확률 크면 위도,경도 bug_location db에 저장
        {
            Object value = response.values().iterator().next();
            //System.out.println(value);
            int intValue = Integer.parseInt(value.toString());
            this.FrontToAI_service.create(intValue%21, lat, lng);
        }
        return (response);
    }
    private String encodeImageToBase64(String imageUrl) throws IOException {
        Path imagePath = Path.of(imageUrl);
        // Read the bytes of the image file
        byte[] fileContent = Files.readAllBytes(imagePath);
        // Encode the image bytes to Base64
        return Base64.getEncoder().encodeToString(fileContent);
    }

    @GetMapping("/result")
    public Map<String, Object> ResultImage(@RequestParam("insectCode") Integer insect_id) throws IOException {
        String imageUrl = FrontToAI_service.getImagoImageURL(insect_id);

        String base64Encoded = encodeImageToBase64(imageUrl);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("imageUrl", base64Encoded);
        //System.out.println(response);
        return (response);
    }

    @GetMapping("/insectInfo") // label1을 id=${Community_post.id}
    public Map<String, Object> getInsectDetail(@RequestParam("insectCode") Integer insect_id) throws IOException {
        String ImagoimageUrl = FrontToAI_service.getImagoImageURL(insect_id);
        String LarvaimageUrl = FrontToAI_service.getLarvaImageURL(insect_id);
        String EggimageUrl = FrontToAI_service.getEggImageURL(insect_id);
        String insect_info = FrontToAI_service.getBug_DetailInfo(insect_id);
        String insectCM = FrontToAI_service.getBug_HowToKill(insect_id);

        String base64Encoded1 = encodeImageToBase64(ImagoimageUrl);
        String base64Encoded2 = encodeImageToBase64(LarvaimageUrl);
        String base64Encoded3 = encodeImageToBase64(EggimageUrl);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("url3", base64Encoded1);
        response.put("url2", base64Encoded2);
        response.put("url1", base64Encoded3);
        response.put("insectInfoText", insect_info);
        response.put("insectCM", insectCM);

        //System.out.println(base64Encoded1);
        //System.out.println(insect_info);
        //System.out.println(insectCM);
        return (response);
    }

    private Map<String, Object> convertMarkerToMap(Bug_location marker) {
        Map<String, Object> markerMap = Map.of(
                "id", marker.getLocationId(),
                "position", Map.of("lat", marker.getBugLatitude(), "lng", marker.getBugLongitude()),
                "date", marker.getDiagnosedDate(),
                "insectCode", marker.getBugId()
        );
        return markerMap;
    }
    @GetMapping("/insectAroundMe")
    public List<Map<String, Object>> LocationInfo()
    {
        List<Bug_location> Bug_location = this.FrontToAI_service.getAllBugLocation();
        // Convert List<Marker> to List<Map<String, Object>>
        List<Map<String, Object>> markers = Bug_location.stream()
                .map(this::convertMarkerToMap)
                .collect(Collectors.toList());
        // Print the result to the console
        //System.out.println(markers);

        return markers;
    }


}
