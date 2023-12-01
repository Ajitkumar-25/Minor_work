from flask import Flask, request, jsonify
import requests
import torch
from transformers import BertModel
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
app = Flask(__name__)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained("my_bert_model")
label_mapping = {0: 0, 0.5: 1, 1: 2, 1.5: 3, 2: 4, 2.5: 5}


model_name = 'bert-base-uncased'
model1 = BertModel.from_pretrained(model_name)
tokenizer1 = BertTokenizer.from_pretrained(model_name)

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


def get_bert_embeddings(text, model, tokenizer):
    # Tokenize input text
    input_ids = tokenizer.encode(text, return_tensors='pt')

    # Get BERT model embeddings
    with torch.no_grad():
        outputs = model(input_ids)
    
    # Extract the embeddings for the [CLS] token
    embeddings = outputs.last_hidden_state[:, 0, :].numpy()
    
    return embeddings


def calculate_cosine_similarity(embedding1, embedding2):
    # Reshape to (1, -1) to match the shape expected by cosine_similarity
    embedding1 = embedding1.reshape(1, -1)
    embedding2 = embedding2.reshape(1, -1)
    
    # Calculate cosine similarity
    similarity = cosine_similarity(embedding1, embedding2)
    
    return similarity[0][0]


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

    # Get BERT embeddings for the texts
    embedding1 = get_bert_embeddings(data['sampleAns'], model1, tokenizer)
    embedding2 = get_bert_embeddings(data['studentResp'], model1, tokenizer)

    similarity_score = calculate_cosine_similarity(embedding1, embedding2)
    print(f"Cosine Similarity Score: {similarity_score}")
    print(f"Score after considering similarity: {similarity_score*predicted_grade}")

    marks = {'grade':predicted_grade, 'label':predicted_label,'similarity_score':str(similarity_score),'final_grade':str(similarity_score*predicted_grade)}
    return jsonify(marks)

if __name__ == '__main__':
    app.run(debug=True)
