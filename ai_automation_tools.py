#!/usr/bin/env python3
"""
AI Automation Tools - Khóa Học AI Automation
Các công cụ để thực hành các bài tập trong khóa học

Yêu cầu:
- Claude API key (set ANTHROPIC_API_KEY env variable)
- Python 3.8+

Cài đặt:
pip install anthropic pandas openpyxl
"""

import json
import csv
import os
from pathlib import Path
from anthropic import Anthropic

client = Anthropic()

# ============================================================================
# MODULE 1: EMAIL MARKETING AUTOMATION
# ============================================================================

def generate_personalized_emails(customer_data: list, email_template: str) -> list:
    """
    Generate personalized emails for multiple customers using Claude.

    Args:
        customer_data: List of dictionaries with customer info
        email_template: Email template with {{variable}} placeholders

    Returns:
        List of personalized emails
    """
    print("\n📧 Generating personalized emails using Claude AI...\n")

    customer_list = "\n".join([
        f"Customer {i+1}: {json.dumps(customer)}"
        for i, customer in enumerate(customer_data)
    ])

    prompt = f"""Generate personalized emails for these customers based on the template.

Template:
{email_template}

Customer Data:
{customer_list}

Requirements:
- Personalize each email with customer-specific information
- Replace {{variable}} with actual customer data
- Keep the tone and structure from template
- Output as JSON array with email_id, subject, and body

Output format:
[
  {{"email_id": 1, "to": "customer@email.com", "subject": "...", "body": "..."}}
]
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text

    try:
        start = response_text.find('[')
        end = response_text.rfind(']') + 1
        emails = json.loads(response_text[start:end])

        print(f"✓ Successfully generated {len(emails)} personalized emails!\n")

        for email in emails[:3]:
            print(f"Email to: {email['to']}")
            print(f"Subject: {email['subject']}\n")

        return emails
    except json.JSONDecodeError:
        print("Error parsing Claude response. Raw response:")
        print(response_text)
        return []


# ============================================================================
# MODULE 2: DATA CLEANING & PROCESSING
# ============================================================================

def clean_company_data(raw_data: str) -> list:
    """
    Clean and normalize company data using Claude.

    Args:
        raw_data: String with company data (messy format)

    Returns:
        List of cleaned company records
    """
    print("\n🧹 Cleaning company data using Claude AI...\n")

    prompt = f"""Clean and normalize this company data.

Raw Data:
{raw_data}

Requirements:
1. Remove duplicates (keep only unique companies)
2. Normalize phone format to: 0XXXXXXXXX
3. Standardize addresses (proper capitalization, consistent format)
4. Remove incomplete records
5. Remove special characters and extra spaces

Output as JSON array:
[
  {{"name": "...", "phone": "...", "address": "...", "email": "..."}}
]
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text

    try:
        start = response_text.find('[')
        end = response_text.rfind(']') + 1
        cleaned_data = json.loads(response_text[start:end])

        print(f"✓ Cleaned {len(cleaned_data)} company records!\n")
        print("Sample cleaned records:")
        for company in cleaned_data[:3]:
            print(f"  - {company['name']}: {company['phone']}\n")

        return cleaned_data
    except json.JSONDecodeError:
        print("Error parsing response. Raw response:")
        print(response_text)
        return []


# ============================================================================
# MODULE 3: CONTENT GENERATION
# ============================================================================

def generate_social_media_posts(niche: str, num_posts: int = 30) -> list:
    """
    Generate social media posts for a specific niche using Claude.

    Args:
        niche: Topic/niche for content
        num_posts: Number of posts to generate

    Returns:
        List of social media posts
    """
    print(f"\n📱 Generating {num_posts} social media posts for niche: {niche}\n")

    prompt = f"""Create {num_posts} social media posts for the niche: {niche}

Requirements:
- Mix content types: 50% Educational, 30% Motivational, 20% Promotional
- Each post should have:
  - Engaging caption (150-250 characters)
  - 5-10 relevant hashtags
  - Call-to-action (CTA)
  - Platform recommendation (Instagram/LinkedIn/TikTok)

Output as JSON array:
[
  {{
    "post_id": 1,
    "platform": "instagram",
    "type": "educational",
    "caption": "...",
    "hashtags": ["#tag1", "#tag2"],
    "cta": "..."
  }}
]
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=3000,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text

    try:
        start = response_text.find('[')
        end = response_text.rfind(']') + 1
        posts = json.loads(response_text[start:end])

        print(f"✓ Generated {len(posts)} posts!\n")
        print("Sample posts:")
        for post in posts[:3]:
            print(f"Platform: {post['platform'].upper()}")
            print(f"Caption: {post['caption']}")
            print(f"CTA: {post['cta']}\n")

        return posts
    except json.JSONDecodeError:
        print("Error parsing response.")
        return []


def optimize_blog_for_seo(blog_content: str) -> dict:
    """
    Optimize blog content for SEO using Claude.

    Args:
        blog_content: Full blog post content

    Returns:
        Dictionary with SEO suggestions and optimized content
    """
    print("\n🔍 Optimizing blog for SEO...\n")

    prompt = f"""Analyze and optimize this blog post for SEO:

Blog Content:
{blog_content}

Provide:
1. Keyword analysis and density
2. Improved meta description (160 chars)
3. Optimized heading structure (H1, H2, H3)
4. 5 internal link suggestions
5. 10 related keywords for LSI
6. Overall SEO score (0-100)

Output as JSON:
{{
  "meta_description": "...",
  "keywords": [...],
  "internal_links": [...],
  "seo_score": 85,
  "recommendations": [...]
}}
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1500,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    response_text = message.content[0].text

    try:
        start = response_text.find('{')
        end = response_text.rfind('}') + 1
        seo_result = json.loads(response_text[start:end])

        print(f"✓ SEO Analysis Complete!\n")
        print(f"SEO Score: {seo_result['seo_score']}/100")
        print(f"Meta Description: {seo_result['meta_description']}\n")
        print(f"Keywords: {', '.join(seo_result['keywords'][:5])}\n")

        return seo_result
    except json.JSONDecodeError:
        print("Error parsing response.")
        return {}


# ============================================================================
# MODULE 4: AUTOMATION SETUP HELPER
# ============================================================================

def create_zapier_guide(automation_type: str) -> str:
    """
    Create a step-by-step guide for setting up Zapier automation.

    Args:
        automation_type: Type of automation (email_to_sheets, etc.)

    Returns:
        Guide text
    """
    print(f"\n⚙️ Creating Zapier setup guide for: {automation_type}\n")

    prompts = {
        "email_to_sheets": "Create a step-by-step guide to set up a Zapier automation that captures emails from Gmail and saves the data to Google Sheets",
        "sheets_to_email": "Create a step-by-step guide to set up a Zapier automation that triggers when a new row is added to Google Sheets and sends personalized emails",
        "content_to_social": "Create a step-by-step guide to set up a Zapier automation that posts content from Google Sheets to Instagram and LinkedIn daily"
    }

    if automation_type not in prompts:
        return f"Unknown automation type: {automation_type}"

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1500,
        messages=[
            {"role": "user", "content": prompts[automation_type] + "\n\nProvide detailed, numbered steps that beginners can follow."}
        ]
    )

    guide = message.content[0].text
    print(guide)
    return guide


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def save_to_csv(data: list, filename: str) -> str:
    """Save data to CSV file."""
    if not data:
        return "No data to save"

    filepath = Path(filename)

    keys = set()
    for item in data:
        keys.update(item.keys())

    keys = list(keys)

    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)

    print(f"✓ Data saved to {filepath}\n")
    return str(filepath)


def interactive_demo():
    """Interactive demo of all tools."""
    print("\n" + "="*60)
    print("🤖 AI AUTOMATION TOOLS - Interactive Demo")
    print("="*60 + "\n")

    while True:
        print("Choose an option:")
        print("1. Generate Personalized Emails")
        print("2. Clean Company Data")
        print("3. Generate Social Media Posts")
        print("4. Optimize Blog for SEO")
        print("5. Create Zapier Setup Guide")
        print("6. Exit")

        choice = input("\nEnter choice (1-6): ").strip()

        if choice == "1":
            customers = [
                {"name": "Anh Minh", "email": "minh@gmail.com", "product": "Laptop", "price": "15M", "date": "2024-01-15"},
                {"name": "Chị Lan", "email": "lan@gmail.com", "product": "Mouse", "price": "200k", "date": "2024-01-20"},
                {"name": "Bác Tuấn", "email": "tuan@gmail.com", "product": "Keyboard", "price": "500k", "date": "2024-01-22"},
            ]

            template = """Subject: Cảm ơn {{name}}, {{product}} của bạn tuyệt vời!

Chào {{name}},

Cảm ơn bạn đã mua {{product}} từ chúng tôi vào ngày {{date}}.

Chúng tôi hy vọng {{product}} này thật sự hữu ích cho bạn.

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.

Thân ái,
Team"""

            emails = generate_personalized_emails(customers, template)
            if emails:
                save_to_csv(emails, "generated_emails.csv")

        elif choice == "2":
            raw_data = """
            ABC Company, 0987654321, 123 Le Loi, HCM
            abc company, +84-987-654-321, 123 Lê Lợi, TP. HCM
            XYZ Corp, 0912345678, 456 Nguyen Hue
            XYZ Corp, 0912345678, 456 Nguyễn Huệ, HCMC
            """

            cleaned = clean_company_data(raw_data)
            if cleaned:
                save_to_csv(cleaned, "cleaned_companies.csv")

        elif choice == "3":
            niche = input("Enter niche (e.g., Digital Marketing, Fitness): ").strip()
            if niche:
                posts = generate_social_media_posts(niche, 5)
                if posts:
                    save_to_csv(posts, f"social_posts_{niche.lower().replace(' ', '_')}.csv")

        elif choice == "4":
            blog = """
            The Power of Artificial Intelligence in Modern Business

            AI has revolutionized how businesses operate today. From automating repetitive tasks
            to providing data-driven insights, AI offers unprecedented opportunities for growth.

            Key Benefits:
            1. Increased Efficiency
            2. Cost Reduction
            3. Better Decision Making

            Conclusion: AI is no longer optional - it's essential.
            """

            optimize_blog_for_seo(blog)

        elif choice == "5":
            automation_type = input("Choose automation (email_to_sheets/sheets_to_email/content_to_social): ").strip()
            if automation_type in ["email_to_sheets", "sheets_to_email", "content_to_social"]:
                create_zapier_guide(automation_type)

        elif choice == "6":
            print("\nThank you for using AI Automation Tools! 👋\n")
            break

        else:
            print("Invalid choice. Please try again.\n")


if __name__ == "__main__":
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("⚠️ Please set ANTHROPIC_API_KEY environment variable")
        print("Export it: export ANTHROPIC_API_KEY='your-key-here'")
        exit(1)

    interactive_demo()
