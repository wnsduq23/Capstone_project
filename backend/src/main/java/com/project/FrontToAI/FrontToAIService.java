package com.project.FrontToAI;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Community.DataNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FrontToAIService
{
    private final Bug_tableRepository Bug_tableRepository;
    private final Bug_locationRepository Bug_locationRepository;
    private Map<String, Object> response;

    private static String executeCommand(String command) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            boolean jsonStarted = false;

            while ((line = reader.readLine()) != null) {
                if (jsonStarted || line.trim().startsWith("{")) {
                    output.append(line).append("\n");
                    jsonStarted = true;  // Set a flag to indicate the JSON has started
                }
            }
        }
        int exitCode;
        try {
            exitCode = process.waitFor();
        } catch (InterruptedException e) {
            throw new IOException("Command execution interrupted", e);
        }
        //System.out.println("1 : " + output.toString().trim());
        return output.toString().trim();
    }
    public Map<String, Object> GetInfoFromAI(Integer agri_id, String photo) throws IOException // 작물 id, jpg 이미지 파일
    {

        String aiServerUrl = "http://3.34.48.13:8000/send_json";
        String curlCommand = "curl -X POST -F \"file=@" + photo + "\" -F \"crop_type=" + agri_id.toString() + "\" " + aiServerUrl;
        //System.out.println(curlCommand);

        //--------------------****-----------------------------
        String aiServerResponse = executeCommand(curlCommand);


        //--------------------%%%%%%%---------------------------
        //System.out.println("4 : " + aiServerResponse);
        // Initialize Jackson ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();

        // Parse JSON content
        try
        {
            JsonNode rootNode = objectMapper.readTree(aiServerResponse);
            JsonNode diagnosisNode = rootNode.get("diagnosis");

            // Initialize a map to store label and probability pairs
            response = new LinkedHashMap<>();

            // Iterate through the top entries and populate the map
            Iterator<Map.Entry<String, JsonNode>> fields = diagnosisNode.fields();
            int n = 1;

            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                JsonNode topEntry = entry.getValue();
                String vN = "v" + n;
                String label = String.valueOf(topEntry.get("label"));
                response.put(vN, label);
                String pN = "p" + n;
                String probability = String.valueOf(topEntry.get("probability"));
                response.put(pN, probability);
                n++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return (response);
    }

    public String getBug_DetailInfo(Integer insect_id) // DB에서 가져오기
    {
        Optional<Bug_table> Bug_table = this.Bug_tableRepository.findById(insect_id);
        return Bug_table.get().getS_BUG_DETAIL();
    }
    public String getBug_HowToKill(Integer insect_id) // DB에서 가져오기
    {
        Optional<Bug_table> Bug_table = this.Bug_tableRepository.findById(insect_id);
        return Bug_table.get().getS_HOW_TO_KILL();
    }

    public void create(Integer Bug_Id, Double lat, Double lng) {
        Bug_location q = new Bug_location();
        q.setBugLatitude(lat);
        q.setBugLongitude(lng);
        q.setDiagnosedDate(LocalDateTime.now());
        q.setBugId(Bug_Id);

        this.Bug_locationRepository.save(q);
    }

    public String getImagoImageURL(Integer id)
    {
        Optional<Bug_table> Bug_table = this.Bug_tableRepository.findById(id);
        if (Bug_table.isPresent())
        {
            return Bug_table.get().getS_IMAGE_URL_Imago();
        }
        else {
            throw new DataNotFoundException("Imago not found");
        }
    }

    public String getLarvaImageURL(Integer id)
    {
        Optional<Bug_table> Bug_table = this.Bug_tableRepository.findById(id);
        if (Bug_table.isPresent())
        {
            return Bug_table.get().getS_IMAGE_URL_Larva();
        }
        else {
            throw new DataNotFoundException("Larva not found");
        }
    }

    public String getEggImageURL(Integer id)
    {
        Optional<Bug_table> Bug_table = this.Bug_tableRepository.findById(id);
        if (Bug_table.isPresent())
        {
            return Bug_table.get().getS_IMAGE_URL_Egg();
        }
        else {
            throw new DataNotFoundException("Egg not found");
        }
    }

    public List<Bug_location> getAllBugLocation()
    {
        return this.Bug_locationRepository.findAll();
    }
}
