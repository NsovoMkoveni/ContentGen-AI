from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# CONTENT GENERATOR
# ==========================================

@app.route("/generate", methods=["POST"])
def generate():

    data = request.get_json()

    topic = data.get("topic", "").strip()
    content_type = data.get("content_type", "Blog Post")
    tone = data.get("tone", "Professional")
    audience = data.get(
        "audience",
        "General audience"
    ).strip()

    length = data.get("length", "Medium")


    # ==========================================
    # CHECK TOPIC
    # ==========================================

    if not topic:

        return jsonify({
            "error": "Please enter a topic."
        }), 400


    # ==========================================
    # TONE INTRODUCTIONS
    # ==========================================

    tone_intros = {

        "Professional":
            f"Understanding {topic.lower()} is increasingly important for {audience}.",

        "Friendly":
            f"Let's take a closer look at {topic.lower()} and why it matters for {audience}.",

        "Casual":
            f"Have you ever wondered why {topic.lower()} is important for {audience}?",

        "Persuasive":
            f"Now is a great time for {audience} to learn more about {topic.lower()}.",

        "Creative":
            f"Imagine a world where {topic.lower()} becomes a powerful part of everyday learning and innovation."

    }


    intro = tone_intros.get(
        tone,
        tone_intros["Professional"]
    )


    # ==========================================
    # VARIATION SENTENCES
    # ==========================================

    variations = [

        f"Learning about {topic.lower()} can help people develop valuable knowledge and practical skills.",

        f"For {audience}, understanding {topic.lower()} can create opportunities for learning and professional development.",

        f"Practical experience with {topic.lower()} can make it easier to understand how technology is used in real-world situations.",

        f"Continuous learning is important because technology and industry requirements continue to change.",

        f"Combining theoretical knowledge with practical projects can make learning about {topic.lower()} more meaningful."

    ]


    selected_variations = random.sample(
        variations,
        2 if length == "Short"
        else 3 if length == "Medium"
        else 5
    )


    # ==========================================
    # LINKEDIN POST
    # ==========================================

    if content_type == "LinkedIn Post":

        content = f"""🚀 {topic}

{intro}

{selected_variations[0]}

{selected_variations[1]}

Keep learning. Keep practising. Keep growing. 💻🚀

#IT #Technology #Learning #CareerDevelopment #ProfessionalGrowth"""


        if length == "Long":

            content += f"""

Here are a few areas worth focusing on:

💡 Build a strong understanding of the fundamentals.

🛠️ Gain practical experience through projects.

📚 Continue learning as technology changes.

🤝 Connect with other students and professionals.

What skills are you currently working on developing?

#SkillsDevelopment #FutureOfTechnology"""


    # ==========================================
    # YOUTUBE DESCRIPTION
    # ==========================================

    elif content_type == "YouTube Description":

        content = f"""🎥 {topic} | Beginner-Friendly Guide

Welcome to the channel! 👋

In this video, we explore {topic.lower()} and explain why it matters for {audience}.

{selected_variations[0]}

You will learn:

✅ The basic concepts
✅ Why the topic is important
✅ Practical considerations
✅ Useful learning tips

Whether you are a beginner or looking to improve your knowledge, this video provides a useful starting point.

👍 Like
💬 Comment
🔔 Subscribe

#IT #Technology #Education #Learning"""


        if length == "Long":

            content += f"""

By the end of the video, you should have a clearer understanding of {topic.lower()} and how it can be applied in practical situations.

Keep learning and exploring new technology! 🚀"""


    # ==========================================
    # PROFESSIONAL EMAIL
    # ==========================================

    elif content_type == "Professional Email":

        content = f"""Subject: Regarding {topic}

Dear Sir/Madam,

I hope you are doing well.

I am writing to discuss {topic.lower()} and its relevance to {audience}.

{selected_variations[0]}

{selected_variations[1]}

I would appreciate the opportunity to learn more about this subject and gain practical experience where possible.

Thank you for your time and consideration.

Kind regards,
Nsovo Mkoveni"""


    # ==========================================
    # ADVERTISEMENT
    # ==========================================

    elif content_type == "Advertisement":

        content = f"""✨ Discover {topic}!

Are you part of {audience} and looking for an opportunity to learn something valuable?

{selected_variations[0]}

🌟 Learn
💡 Grow
🚀 Build your future

Start exploring {topic.lower()} today and take the next step toward developing your skills.

📩 Contact us to learn more."""


    # ==========================================
    # SOCIAL MEDIA CAPTION
    # ==========================================

    elif content_type == "Social Media Caption":

        content = f"""💻 {topic}

{intro}

{selected_variations[0]}

{selected_variations[1]}

Keep learning. Keep growing. Keep building your future. 🚀

#IT #Technology #Learning #Growth #CareerDevelopment"""


    # ==========================================
    # BLOG POST
    # ==========================================

    else:

        content = f"""# {topic}

## Introduction

{intro}

{selected_variations[0]}

## Why It Matters

{selected_variations[1]}

Understanding {topic.lower()} can help people solve problems, develop useful skills and prepare for future opportunities.

## Practical Learning

{selected_variations[-1]}

Hands-on projects, research and continuous practice can help turn theoretical knowledge into practical skills.

"""


        if length == "Medium":

            content += f"""## Key Points

• Learn the fundamentals of {topic.lower()}.

• Practise through real-world projects.

• Continue developing your skills.

## Conclusion

Learning about {topic.lower()} can provide valuable knowledge for {audience}. Combining theory with practical experience can make the learning journey more effective."""


        elif length == "Long":

            content += f"""## Key Areas to Consider

### 1. Build Strong Foundations

A good understanding of the fundamentals can make it easier to develop more advanced skills.

### 2. Gain Practical Experience

Working on projects can help {audience} understand how {topic.lower()} is applied in real situations.

### 3. Keep Learning

Technology continues to develop, which means continuous learning is an important part of professional growth.

### 4. Develop Problem-Solving Skills

Understanding how to analyse challenges and find practical solutions can be valuable when working with technology.

## Conclusion

{topic} is a valuable subject for {audience} to explore.

By combining knowledge, practical experience and continuous learning, individuals can continue developing skills that may support their education and future careers."""


    # ==========================================
    # RETURN RESULT
    # ==========================================

    return jsonify({
        "content": content
    })


# ==========================================
# START FLASK SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )