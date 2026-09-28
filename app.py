from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No information was received."}), 400

    topic = data.get("topic", "").strip()
    content_type = data.get("content_type", "Blog Post")
    tone = data.get("tone", "Professional")
    audience = data.get("audience", "General audience").strip()
    length = data.get("length", "Medium")

    if not topic:
        return jsonify({"error": "Please enter a topic."}), 400

    if length == "Short":
        paragraph_count = 2
    elif length == "Long":
        paragraph_count = 5
    else:
        paragraph_count = 3

    if content_type == "Blog Post":
        content = generate_blog(topic, tone, audience, paragraph_count)
    elif content_type == "Social Media Caption":
        content = generate_social(topic, audience)
    elif content_type == "LinkedIn Post":
        content = generate_linkedin(topic, audience)
    elif content_type == "Professional Email":
        content = generate_email(topic, audience)
    elif content_type == "Advertisement":
        content = generate_advertisement(topic, audience)
    elif content_type == "YouTube Description":
        content = generate_youtube(topic, audience)
    else:
        content = generate_blog(topic, tone, audience, paragraph_count)

    return jsonify({"content": content})


def generate_blog(topic, tone, audience, paragraph_count):
    paragraphs = [
        f"{topic} is an important topic for {audience}. Understanding the key ideas behind {topic} can help individuals and organisations make better decisions and respond effectively to changing needs.",
        f"One important aspect of {topic} is the practical opportunities it can create. By developing a clear understanding of the subject, {audience} can identify challenges, improve their approach and achieve meaningful results.",
        f"Another important consideration is consistent improvement. A {tone.lower()} approach to {topic} encourages people to remain informed, adapt to new developments and focus on solutions that provide long-term value.",
        f"For {audience}, taking action is an effective way to turn knowledge into results. Starting with realistic goals, measuring progress and learning from experience can make the process more effective.",
        f"In conclusion, {topic} provides valuable opportunities for growth and improvement. With the right knowledge, planning and consistent action, {audience} can create positive outcomes."
    ]

    title = f"{topic}: A Practical Guide"

    return title + "\n\n" + "\n\n".join(paragraphs[:paragraph_count])


def generate_social(topic, audience):
    return f"""🚀 {topic}

Discover practical insights and useful ideas that can help {audience} understand and make the most of {topic}.

Stay informed. Keep learning. Keep growing. Your next opportunity could start with one new idea today. 💡

#Innovation #Growth #Learning #Success"""


def generate_linkedin(topic, audience):
    return f"""💡 Why {topic} matters

In today's changing environment, understanding {topic} has become increasingly valuable for {audience}.

A strong understanding of this topic can help professionals identify opportunities, solve problems and make more informed decisions.

Continuous learning and practical experience are important parts of professional growth. Exploring topics such as {topic} can help us develop new skills and perspectives.

What are your thoughts on {topic}?

#ProfessionalDevelopment #Technology #Learning #CareerGrowth"""


def generate_email(topic, audience):
    return f"""Subject: Regarding {topic}

Dear {audience},

I hope you are doing well.

I am writing to share some information regarding {topic}. This is an important area that may provide valuable opportunities for improvement and growth.

I would appreciate the opportunity to discuss this further and explore possible next steps.

Please let me know if you would be available for a discussion at a convenient time.

Kind regards,
Nsovo Mkoveni"""


def generate_advertisement(topic, audience):
    return f"""✨ Discover {topic}!

Looking for a better way to improve your experience with {topic}? Our solution is designed to provide practical value, convenience and meaningful results for {audience}.

Don't miss the opportunity to discover what is possible.

🚀 Explore {topic} today!"""


def generate_youtube(topic, audience):
    return f"""🎥 Welcome to this video about {topic}!

In this video, we explore the key ideas, benefits and practical information you need to know about {topic}.

This video is useful for {audience} who want to learn more and develop a better understanding of the subject.

👍 Like the video if you found it useful.
💬 Share your thoughts in the comments.
🔔 Subscribe for more content.

#Learning #Technology #Education #Growth"""


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)