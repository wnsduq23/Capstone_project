from flask import Flask, request, send_file
import requests
import json
import torch
import torchvision.transforms as transforms
import torchvision.models as models
import io
import os
from PIL import Image
import json
import torch.nn as nn

app = Flask(__name__)



def load_model(crop_type):
    model = models.resnet18(pretrained=True)
    num_ftrs = model.fc.in_features

    if crop_type == '1':
        model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./potato_epoch_9.pth', map_location=torch.device('cpu')))
    
    elif crop_type == '2':
        model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./pepper_epoch_9.pth', map_location=torch.device('cpu')))
    
    elif crop_type == '5':
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./kcabbage_epoch_23.pth', map_location=torch.device('cpu')))
    
    elif crop_type == '6':
        model.fc = nn.Sequential(
        nn.Dropout(0.5),
        nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./rice_epoch_26.pth', map_location=torch.device('cpu')))
    
    elif crop_type == '10':
        model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./bean_epoch_4.pth', map_location=torch.device('cpu')))
    
    elif crop_type == '12':
        model.fc = nn.Sequential(
        nn.Linear(num_ftrs, 65)
        )
        model.load_state_dict(torch.load('./sonion_epoch_12.pth', map_location=torch.device('cpu')))
    else:
        return None
    model.eval()
    return model


def transforms_image(infile):
    input_transforms = [transforms.Resize((448, 448), interpolation=Image.Resampling.BILINEAR), transforms.ToTensor()]
    my_transforms = transforms.Compose(input_transforms)
    image = Image.open(infile)
    timg = my_transforms(image)
    timg.unsqueeze_(0)
    return timg

def get_prediction(model, input_tensor):
    
    outputs = torch.softmax(model(input_tensor), dim=1)
    
    _, y_hat = outputs.max(1)
    prediction = y_hat.item()
    
    top_probabilities, top_indices = outputs.topk(5, dim=1)
    
    
    top_probabilities = top_probabilities[0].tolist() 
    top_indices = top_indices[0].tolist() 
    
    print(f"Returned prediction index: {prediction}")
    print(f"Top 5 probabilities: {top_probabilities}")
    print(f"Top 5 indices: {top_indices}")
    

    return prediction, top_probabilities, top_indices


@app.route('/send_json', methods=['POST'])

def send_json():
    if request.method == 'POST':
        file = request.files['file']
        if file is not None:
            input_tensor = transforms_image(file)
            crop_type = request.form['crop_type']
            model = load_model(crop_type)
            if model is None:
                return "Invalid crop_type"
            
            prediction_idx, top_prob, top_idx = get_prediction(model, input_tensor)
    
            json_data = {
                "I_BUG_ID" : prediction_idx,
                "diagnosis": {    
                    "top1" : {
                        "probability" : top_prob[0],
                        "label" : top_idx[0]
                    },
                    "top2" : {
                        "probability" : top_prob[1],
                        "label" : top_idx[1]
                    },
                    "top3" : {
                        "probability" : top_prob[2],
                        "label" : top_idx[2]
                    },
                    "top4" : {
                        "probability" : top_prob[3],
                        "label" : top_idx[3]
                    },
                    "top5" : {
                        "probability" : top_prob[4],
                        "label" : top_idx[4]
                    }
                }
            }

            json_payload = json.dumps(json_data)
            return json_data
        
           

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

# curl -X POST -F "file=@28_61.jpg" -F "crop_type=1" http://3.34.48.13:8000//send_json    