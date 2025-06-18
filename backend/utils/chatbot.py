import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def ask_chatbot(prompt):
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',  # or 'gpt-4' if you're using GPT-4
        messages=[
            {"role": "system", "content": "You're an expense tracking assistant. Answer clearly and helpfully."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message['content'].strip()