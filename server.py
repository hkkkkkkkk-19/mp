
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid

app = Flask(__name__)
CORS(app)  # Critical for frontend communication

# AWS Bedrock Client Configuration
client = boto3.client(
    "bedrock-agent-runtime",
    region_name="us-east-1"
)

# Your Provided Agent Credentials
AGENT_ID = "EUCTO9JK9G"
ALIAS_ID = "PK871EO5VV"

@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_msg = request.json["message"]
        session_id = request.json.get("sessionId", str(uuid.uuid4()))

        response = client.invoke_agent(
            agentId=AGENT_ID,
            agentAliasId=ALIAS_ID,
            sessionId=session_id,
            inputText=user_msg
        )

        reply = ""
        for event in response["completion"]:
            if "chunk" in event:
                reply += event["chunk"]["bytes"].decode()

        return jsonify({
            "reply": reply,
            "sessionId": session_id,
            "agent": AGENT_ID
        })
    except Exception as e:
        print(f"Error invoking Bedrock agent: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/chat", methods=["OPTIONS"])
def options():
    return jsonify({"status": "ok"}), 200

if __name__ == "__main__":
    print(f"--- MedRoute Clinical AI Backend ---")
    print(f"Target Agent: {AGENT_ID}")
    print(f"Target Alias: {ALIAS_ID}")
    print(f"Serving on: http://localhost:5000")
    app.run(debug=True, port=5000)
