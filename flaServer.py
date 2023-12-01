from flask import Flask, request, jsonify
import requests
import torch
from transformers import BertModel
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
app = Flask(__name__)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained("my_bert_model")
label_mapping = {0: 0, 0.5: 1, 1: 2, 1.5: 3, 2: 4, 2.5: 5}
def predict_grade(sample_response, student_response, model, tokenizer):
    #model.eval()

    # Convert to strings
    sample_response = str(sample_response)
    student_response = str(student_response)

    print("sample response", sample_response)
    print("student response", student_response)

    # Tokenize and encode the input
    encoding = tokenizer(
        sample_response,
        student_response,
        truncation=True,
        max_length=512,
        padding='max_length',
        return_tensors='pt'
    )

    # Move tensors to device
    input_ids = encoding['input_ids']
    attention_mask = encoding['attention_mask']

    # Make the prediction
    with torch.no_grad():
        outputs = model(input_ids, attention_mask=attention_mask)
        predicted_label = torch.argmax(outputs.logits, dim=1).item()

    # Map the predicted label back to the original grade
    grade_mapping_reverse = {v: k for k, v in label_mapping.items()}
    predicted_grade = grade_mapping_reverse[predicted_label]

    return predicted_grade, predicted_label



@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/receive-data', methods=['POST'])
def receive_data():
    data = request.json  # Assuming the data is sent in JSON format
    # message = list(data.keys())[1]
# Make the prediction
    print("sampleAns",data['studentResp'])
    print("responseAns", data['sampleAns'])
    predicted_grade, predicted_label = predict_grade(data['sampleAns'], data['studentResp'], model, tokenizer)
    
    print(f"Predicted Grade: {predicted_grade}")
    print(f"Predicted Label: {predicted_label}")
    marks = {'grade':predicted_grade, 'label':predicted_label}
    return jsonify(marks)

if __name__ == '__main__':
    app.run(debug=True)
